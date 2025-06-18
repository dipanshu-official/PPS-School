import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Attendance from '../models/Attendance.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/attendance
// @desc    Get attendance records with filtering
// @access  Private (Admin, Teacher, Staff)
router.get('/', authorize('administrator', 'teacher', 'staff'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('date').optional().isISO8601().withMessage('Valid date is required'),
  query('course').optional().isMongoId().withMessage('Valid course ID is required'),
  query('student').optional().isMongoId().withMessage('Valid student ID is required'),
  query('status').optional().isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      filter.date = { $gte: date, $lt: nextDay };
    }
    if (req.query.course) filter.course = req.query.course;
    if (req.query.student) filter.student = req.query.student;
    if (req.query.status) filter.status = req.query.status;

    const attendanceRecords = await Attendance.find(filter)
      .populate('student', 'firstName lastName studentId grade')
      .populate('course', 'title courseCode')
      .populate('recordedBy', 'firstName lastName')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Attendance.countDocuments(filter);

    res.json({
      success: true,
      data: {
        attendanceRecords,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance records'
    });
  }
});

// @route   POST /api/attendance
// @desc    Create attendance record
// @access  Private (Admin, Teacher, Staff)
router.post('/', authorize('administrator', 'teacher', 'staff'), [
  body('student').isMongoId().withMessage('Valid student ID is required'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid status'),
  body('date').optional().isISO8601().withMessage('Valid date is required'),
  body('timeIn').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('timeOut').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { student, course, status, date, timeIn, timeOut, notes } = req.body;

    // Verify student exists
    const studentDoc = await Student.findById(student);
    if (!studentDoc) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify course exists
    const courseDoc = await Course.findById(course);
    if (!courseDoc) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if attendance record already exists for this date
    const attendanceDate = date ? new Date(date) : new Date();
    const existingRecord = await Attendance.findOne({
      student,
      course,
      date: {
        $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
        $lt: new Date(attendanceDate.setHours(23, 59, 59, 999))
      }
    });

    if (existingRecord) {
      return res.status(400).json({
        success: false,
        message: 'Attendance record already exists for this date'
      });
    }

    const attendanceRecord = new Attendance({
      student,
      course,
      status,
      date: attendanceDate,
      timeIn,
      timeOut,
      notes,
      recordedBy: req.user._id
    });

    await attendanceRecord.save();
    await attendanceRecord.populate('student', 'firstName lastName studentId');
    await attendanceRecord.populate('course', 'title courseCode');

    res.status(201).json({
      success: true,
      message: 'Attendance recorded successfully',
      data: { attendanceRecord }
    });
  } catch (error) {
    console.error('Create attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record attendance'
    });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance record
// @access  Private (Admin, Teacher, Staff)
router.put('/:id', authorize('administrator', 'teacher', 'staff'), [
  body('status').optional().isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid status'),
  body('timeIn').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
  body('timeOut').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const attendanceRecord = await Attendance.findById(req.params.id);
    if (!attendanceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found'
      });
    }

    Object.assign(attendanceRecord, req.body);
    await attendanceRecord.save();

    await attendanceRecord.populate('student', 'firstName lastName studentId');
    await attendanceRecord.populate('course', 'title courseCode');

    res.json({
      success: true,
      message: 'Attendance record updated successfully',
      data: { attendanceRecord }
    });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance record'
    });
  }
});

// @route   GET /api/attendance/stats/overview
// @desc    Get attendance statistics
// @access  Private (Admin, Teacher, Staff)
router.get('/stats/overview', authorize('administrator', 'teacher', 'staff'), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const weeklyStats = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          statuses: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        todayStats,
        weeklyStats
      }
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance statistics'
    });
  }
});

export default router;