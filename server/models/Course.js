import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Course title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Mathematics', 'Science', 'English', 'History', 'Arts', 'Physical Education', 'Computer Science']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Teacher is required']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: 1,
    max: 6
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    enum: ['1 Semester', '2 Semesters', 'Full Year']
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }],
    time: {
      start: String,
      end: String
    },
    room: String
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: 1,
    max: 50
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['Fall', 'Spring', 'Summer']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 2020,
    max: 2030
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

// Virtual for enrolled count
courseSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for available spots
courseSchema.virtual('availableSpots').get(function() {
  return this.capacity - this.enrolledStudents.length;
});

// Pre-save middleware to generate course code
courseSchema.pre('save', async function(next) {
  if (!this.courseCode) {
    const deptCode = this.department.substring(0, 4).toUpperCase();
    const count = await mongoose.model('Course').countDocuments({ department: this.department });
    this.courseCode = `${deptCode}-${String(count + 101)}`;
  }
  this.updatedAt = Date.now();
  next();
});


export default mongoose.model('Course', courseSchema);