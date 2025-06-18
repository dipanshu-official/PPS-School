import mongoose from 'mongoose';

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  assignment: {
    type: String,
    required: [true, 'Assignment name is required'],
    trim: true,
    maxlength: [100, 'Assignment name cannot exceed 100 characters']
  },
  category: {
    type: String,
    enum: ['homework', 'quiz', 'test', 'project', 'final', 'midterm', 'participation'],
    required: [true, 'Assignment category is required']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: 0
  },
  maxScore: {
    type: Number,
    required: [true, 'Maximum score is required'],
    min: 1
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
  },
  weight: {
    type: Number,
    min: 0,
    max: 100,
    default: 1
  },
  dueDate: {
    type: Date
  },
  submittedDate: {
    type: Date
  },
  feedback: {
    type: String,
    maxlength: [500, 'Feedback cannot exceed 500 characters']
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Graded by is required']
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate percentage and letter grade
gradeSchema.pre('save', function(next) {
  // Calculate percentage
  this.percentage = Math.round((this.score / this.maxScore) * 100);
  
  // Calculate letter grade
  if (this.percentage >= 97) this.letterGrade = 'A+';
  else if (this.percentage >= 93) this.letterGrade = 'A';
  else if (this.percentage >= 90) this.letterGrade = 'A-';
  else if (this.percentage >= 87) this.letterGrade = 'B+';
  else if (this.percentage >= 83) this.letterGrade = 'B';
  else if (this.percentage >= 80) this.letterGrade = 'B-';
  else if (this.percentage >= 77) this.letterGrade = 'C+';
  else if (this.percentage >= 73) this.letterGrade = 'C';
  else if (this.percentage >= 70) this.letterGrade = 'C-';
  else if (this.percentage >= 67) this.letterGrade = 'D+';
  else if (this.percentage >= 63) this.letterGrade = 'D';
  else if (this.percentage >= 60) this.letterGrade = 'D-';
  else this.letterGrade = 'F';
  
  this.updatedAt = Date.now();
  next();
});



export default mongoose.model('Grade', gradeSchema);