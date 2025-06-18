import express from 'express';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';
import Grade from '../models/Grade.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin, Staff)
router.get('/stats', authorize('administrator', 'staff'), async (req, res) => {
  try {
    // Basic counts
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: 'active' });
    const totalTeachers = await Teacher.countDocuments();
    const activeTeachers = await Teacher.countDocuments({ status: 'active' });
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ status: 'active' });

    // Attendance statistics for today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayAttendance = await Attendance.aggregate([
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

    const attendanceStats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    };

    todayAttendance.forEach(stat => {
      attendanceStats[stat._id] = stat.count;
    });

    const totalAttendanceToday = Object.values(attendanceStats).reduce((sum, count) => sum + count, 0);
    const attendanceRate = totalAttendanceToday > 0 
      ? ((attendanceStats.present + attendanceStats.late) / totalAttendanceToday * 100).toFixed(1)
      : 0;

    // Grade distribution
    const gradeDistribution = await Grade.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$letterGrade',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Recent activities (last 10)
    const recentGrades = await Grade.find({ isPublished: true })
      .populate('student', 'firstName lastName')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentEnrollments = await Student.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(5);

    // Weekly attendance trend
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyAttendance = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: weekAgo }
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
          present: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'present'] }, '$count', 0]
            }
          },
          total: { $sum: '$count' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents,
          activeStudents,
          totalTeachers,
          activeTeachers,
          totalCourses,
          activeCourses,
          attendanceRate: parseFloat(attendanceRate)
        },
        attendance: {
          today: attendanceStats,
          rate: parseFloat(attendanceRate),
          weekly: weeklyAttendance
        },
        grades: {
          distribution: gradeDistribution,
          recent: recentGrades
        },
        recentActivities: {
          enrollments: recentEnrollments,
          grades: recentGrades
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// @route   GET /api/dashboard/teacher-stats
// @desc    Get teacher-specific dashboard statistics
// @access  Private (Teacher)
router.get('/teacher-stats', authorize('teacher'), async (req, res) => {
  try {
    // Find teacher record
    const teacher = await Teacher.findOne({ email: req.user.email });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher profile not found'
      });
    }

    // Get teacher's courses
    const courses = await Course.find({ teacher: teacher._id })
      .populate('enrolledStudents', 'firstName lastName studentId');

    const courseIds = courses.map(course => course._id);
    const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents.length, 0);

    // Get recent attendance for teacher's courses
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayAttendance = await Attendance.aggregate([
      {
        $match: {
          course: { $in: courseIds },
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

    const attendanceStats = {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0
    };

    todayAttendance.forEach(stat => {
      attendanceStats[stat._id] = stat.count;
    });

    // Get recent grades for teacher's courses
    const recentGrades = await Grade.find({ course: { $in: courseIds } })
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'title courseCode')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get grade distribution for teacher's courses
    const gradeDistribution = await Grade.aggregate([
      { $match: { course: { $in: courseIds }, isPublished: true } },
      {
        $group: {
          _id: '$letterGrade',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalCourses: courses.length,
          totalStudents,
          activeCourses: courses.filter(c => c.status === 'active').length
        },
        courses: courses.map(course => ({
          _id: course._id,
          title: course.title,
          courseCode: course.courseCode,
          enrolledCount: course.enrolledStudents.length,
          capacity: course.capacity
        })),
        attendance: {
          today: attendanceStats
        },
        grades: {
          distribution: gradeDistribution,
          recent: recentGrades.slice(0, 5)
        }
      }
    });
  } catch (error) {
    console.error('Get teacher dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch teacher dashboard statistics'
    });
  }
});

export default router;