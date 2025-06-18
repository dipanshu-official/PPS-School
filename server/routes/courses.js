import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Course from '../models/Course.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/courses
// @desc    Get all courses with pagination and filtering
// @access  Private (All authenticated users)
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('department').optional().isIn(['Mathematics', 'Science', 'English', 'History', 'Arts', 'Physical Education', 'Computer Science']).withMessage('Invalid department'),
  query('status').optional().isIn(['active', 'inactive', 'completed']).withMessage('Invalid status')
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
    if (req.query.department) filter.department = req.query.department;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { courseCode: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(filter)
      .populate('teacher', 'firstName lastName email')
      .populate('enrolledStudents', 'firstName lastName studentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses'
    });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Private (All authenticated users)
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'firstName lastName email phone department')
      .populate('enrolledStudents', 'firstName lastName studentId email grade');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: { course }
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course'
    });
  }
});

// @route   POST /api/courses
// @desc    Create new course
// @access  Private (Admin only)
router.post('/', authorize('administrator'), [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('department').isIn(['Mathematics', 'Science', 'English', 'History', 'Arts', 'Physical Education', 'Computer Science']).withMessage('Invalid department'),
  body('teacher').isMongoId().withMessage('Valid teacher ID is required'),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('duration').isIn(['1 Semester', '2 Semesters', 'Full Year']).withMessage('Invalid duration'),
  body('capacity').isInt({ min: 1, max: 50 }).withMessage('Capacity must be between 1 and 50'),
  body('semester').isIn(['Fall', 'Spring', 'Summer']).withMessage('Invalid semester'),
  body('year').isInt({ min: 2020, max: 2030 }).withMessage('Year must be between 2020 and 2030')
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

    // Verify teacher exists
    const teacher = await Teacher.findById(req.body.teacher);
    if (!teacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    const course = new Course(req.body);
    await course.save();

    // Add course to teacher's courses
    teacher.courses.push(course._id);
    await teacher.save();

    await course.populate('teacher', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create course'
    });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Admin only)
router.put('/:id', authorize('administrator'), [
  body('title').optional().trim().notEmpty().withMessage('Course title cannot be empty'),
  body('department').optional().isIn(['Mathematics', 'Science', 'English', 'History', 'Arts', 'Physical Education', 'Computer Science']).withMessage('Invalid department'),
  body('teacher').optional().isMongoId().withMessage('Valid teacher ID is required'),
  body('credits').optional().isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('duration').optional().isIn(['1 Semester', '2 Semesters', 'Full Year']).withMessage('Invalid duration'),
  body('capacity').optional().isInt({ min: 1, max: 50 }).withMessage('Capacity must be between 1 and 50'),
  body('status').optional().isIn(['active', 'inactive', 'completed']).withMessage('Invalid status')
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

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // If teacher is being changed, verify new teacher exists
    if (req.body.teacher && req.body.teacher !== course.teacher.toString()) {
      const newTeacher = await Teacher.findById(req.body.teacher);
      if (!newTeacher) {
        return res.status(400).json({
          success: false,
          message: 'New teacher not found'
        });
      }

      // Remove course from old teacher
      const oldTeacher = await Teacher.findById(course.teacher);
      if (oldTeacher) {
        oldTeacher.courses.pull(course._id);
        await oldTeacher.save();
      }

      // Add course to new teacher
      newTeacher.courses.push(course._id);
      await newTeacher.save();
    }

    Object.assign(course, req.body);
    await course.save();

    await course.populate('teacher', 'firstName lastName email');

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: { course }
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update course'
    });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll student in course
// @access  Private (Admin, Staff)
router.post('/:id/enroll', authorize('administrator', 'staff'), [
  body('studentId').isMongoId().withMessage('Valid student ID is required')
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

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const student = await Student.findById(req.body.studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if course is full
    if (course.enrolledStudents.length >= course.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Course is full'
      });
    }

    // Check if student is already enrolled
    if (course.enrolledStudents.includes(student._id)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }

    // Enroll student
    course.enrolledStudents.push(student._id);
    student.courses.push(course._id);

    await course.save();
    await student.save();

    res.json({
      success: true,
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to enroll student'
    });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Admin only)
router.delete('/:id', authorize('administrator'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove course from teacher
    const teacher = await Teacher.findById(course.teacher);
    if (teacher) {
      teacher.courses.pull(course._id);
      await teacher.save();
    }

    // Remove course from all enrolled students
    await Student.updateMany(
      { _id: { $in: course.enrolledStudents } },
      { $pull: { courses: course._id } }
    );

    await Course.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete course'
    });
  }
});

export default router;