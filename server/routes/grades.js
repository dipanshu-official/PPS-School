import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Grade from '../models/Grade.js';
import Student from '../models/Student.js';
import Course from '../models/Course.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// @route   GET /api/grades
// @desc    Get grades with filtering
// @access  Private (Admin, Teacher, Staff)
router.get('/', authorize('administrator', 'teacher', 'staff'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('course').optional().isMongoId().withMessage('Valid course ID is required'),
  query('student').optional().isMongoId().withMessage('Valid student ID is required'),
  query('category').optional().isIn(['homework', 'quiz', 'test', 'project', 'final', 'midterm', 'participation']).withMessage('Invalid category'),
  query('isPublished').optional().isBoolean().withMessage('isPublished must be boolean')
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
    if (req.query.course) filter.course = req.query.course;
    if (req.query.student) filter.student = req.query.student;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isPublished !== undefined) filter.isPublished = req.query.isPublished === 'true';

    const grades = await Grade.find(filter)
      .populate('student', 'firstName lastName studentId grade')
      .populate('course', 'title courseCode department')
      .populate('gradedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Grade.countDocuments(filter);

    res.json({
      success: true,
      data: {
        grades,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades'
    });
  }
});

// @route   GET /api/grades/:id
// @desc    Get grade by ID
// @access  Private (Admin, Teacher, Staff)
router.get('/:id', authorize('administrator', 'teacher', 'staff'), async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'firstName lastName studentId grade')
      .populate('course', 'title courseCode department')
      .populate('gradedBy', 'firstName lastName');

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.json({
      success: true,
      data: { grade }
    });
  } catch (error) {
    console.error('Get grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grade'
    });
  }
});

// @route   POST /api/grades
// @desc    Create new grade
// @access  Private (Admin, Teacher)
router.post('/', authorize('administrator', 'teacher'), [
  body('student').isMongoId().withMessage('Valid student ID is required'),
  body('course').isMongoId().withMessage('Valid course ID is required'),
  body('assignment').trim().notEmpty().withMessage('Assignment name is required'),
  body('category').isIn(['homework', 'quiz', 'test', 'project', 'final', 'midterm', 'participation']).withMessage('Invalid category'),
  body('score').isFloat({ min: 0 }).withMessage('Score must be a non-negative number'),
  body('maxScore').isFloat({ min: 1 }).withMessage('Maximum score must be at least 1'),
  body('weight').optional().isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  body('submittedDate').optional().isISO8601().withMessage('Valid submitted date is required')
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

    const { student, course, assignment, category, score, maxScore } = req.body;

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

    // Validate score doesn't exceed max score
    if (score > maxScore) {
      return res.status(400).json({
        success: false,
        message: 'Score cannot exceed maximum score'
      });
    }

    const grade = new Grade({
      ...req.body,
      gradedBy: req.user._id
    });

    await grade.save();
    await grade.populate('student', 'firstName lastName studentId');
    await grade.populate('course', 'title courseCode');

    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      data: { grade }
    });
  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create grade'
    });
  }
});

// @route   PUT /api/grades/:id
// @desc    Update grade
// @access  Private (Admin, Teacher)
router.put('/:id', authorize('administrator', 'teacher'), [
  body('assignment').optional().trim().notEmpty().withMessage('Assignment name cannot be empty'),
  body('category').optional().isIn(['homework', 'quiz', 'test', 'project', 'final', 'midterm', 'participation']).withMessage('Invalid category'),
  body('score').optional().isFloat({ min: 0 }).withMessage('Score must be a non-negative number'),
  body('maxScore').optional().isFloat({ min: 1 }).withMessage('Maximum score must be at least 1'),
  body('weight').optional().isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be boolean')
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

    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    // Validate score doesn't exceed max score if both are provided
    const newScore = req.body.score !== undefined ? req.body.score : grade.score;
    const newMaxScore = req.body.maxScore !== undefined ? req.body.maxScore : grade.maxScore;
    
    if (newScore > newMaxScore) {
      return res.status(400).json({
        success: false,
        message: 'Score cannot exceed maximum score'
      });
    }

    Object.assign(grade, req.body);
    await grade.save();

    await grade.populate('student', 'firstName lastName studentId');
    await grade.populate('course', 'title courseCode');

    res.json({
      success: true,
      message: 'Grade updated successfully',
      data: { grade }
    });
  } catch (error) {
    console.error('Update grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update grade'
    });
  }
});

// @route   DELETE /api/grades/:id
// @desc    Delete grade
// @access  Private (Admin, Teacher)
router.delete('/:id', authorize('administrator', 'teacher'), async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    await Grade.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete grade'
    });
  }
});

// @route   GET /api/grades/student/:studentId/summary
// @desc    Get grade summary for a student
// @access  Private (Admin, Teacher, Staff)
router.get('/student/:studentId/summary', authorize('administrator', 'teacher', 'staff'), async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Verify student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const grades = await Grade.find({ student: studentId, isPublished: true })
      .populate('course', 'title courseCode department');

    // Calculate GPA and course averages
    const courseAverages = {};
    const categoryStats = {};

    grades.forEach(grade => {
      const courseId = grade.course._id.toString();
      
      if (!courseAverages[courseId]) {
        courseAverages[courseId] = {
          course: grade.course,
          grades: [],
          totalPoints: 0,
          totalWeight: 0
        };
      }
      
      courseAverages[courseId].grades.push(grade);
      courseAverages[courseId].totalPoints += grade.percentage * (grade.weight || 1);
      courseAverages[courseId].totalWeight += (grade.weight || 1);

      // Category statistics
      if (!categoryStats[grade.category]) {
        categoryStats[grade.category] = {
          count: 0,
          totalPercentage: 0,
          average: 0
        };
      }
      categoryStats[grade.category].count++;
      categoryStats[grade.category].totalPercentage += grade.percentage;
    });

    // Calculate course averages
    Object.keys(courseAverages).forEach(courseId => {
      const course = courseAverages[courseId];
      course.average = course.totalWeight > 0 ? course.totalPoints / course.totalWeight : 0;
    });

    // Calculate category averages
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.average = stats.totalPercentage / stats.count;
    });

    // Calculate overall GPA (4.0 scale)
    const courseGrades = Object.values(courseAverages);
    const overallAverage = courseGrades.length > 0 
      ? courseGrades.reduce((sum, course) => sum + course.average, 0) / courseGrades.length 
      : 0;
    
    const gpa = overallAverage >= 97 ? 4.0 :
                overallAverage >= 93 ? 3.7 :
                overallAverage >= 90 ? 3.3 :
                overallAverage >= 87 ? 3.0 :
                overallAverage >= 83 ? 2.7 :
                overallAverage >= 80 ? 2.3 :
                overallAverage >= 77 ? 2.0 :
                overallAverage >= 73 ? 1.7 :
                overallAverage >= 70 ? 1.3 :
                overallAverage >= 67 ? 1.0 :
                overallAverage >= 65 ? 0.7 : 0.0;

    res.json({
      success: true,
      data: {
        student: {
          _id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
          studentId: student.studentId,
          grade: student.grade
        },
        summary: {
          gpa: parseFloat(gpa.toFixed(2)),
          overallAverage: parseFloat(overallAverage.toFixed(2)),
          totalGrades: grades.length,
          courseAverages: Object.values(courseAverages),
          categoryStats
        }
      }
    });
  } catch (error) {
    console.error('Get student grade summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student grade summary'
    });
  }
});

export default router;