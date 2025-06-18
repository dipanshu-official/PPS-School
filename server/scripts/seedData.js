import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Course from '../models/Course.js';
import Attendance from '../models/Attendance.js';
import Grade from '../models/Grade.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});
    await Attendance.deleteMany({});
    await Grade.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@school.edu',
      password: 'password123',
      phone: '+1-555-0001',
      role: 'administrator'
    });
    await adminUser.save();
    console.log('👤 Created admin user');

    // Create teachers
    const teachers = [
      {
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.johnson@school.edu',
        phone: '+1-555-0101',
        department: 'Mathematics',
        subjects: ['Algebra', 'Calculus', 'Statistics'],
        experience: 15,
        qualification: {
          degree: 'PhD Mathematics',
          university: 'MIT',
          year: 2008
        }
      },
      {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@school.edu',
        phone: '+1-555-0102',
        department: 'Science',
        subjects: ['Chemistry', 'Biology'],
        experience: 12,
        qualification: {
          degree: 'MS Chemistry',
          university: 'Stanford',
          year: 2011
        }
      },
      {
        firstName: 'Jennifer',
        lastName: 'Lee',
        email: 'jennifer.lee@school.edu',
        phone: '+1-555-0103',
        department: 'English',
        subjects: ['Literature', 'Writing', 'Grammar'],
        experience: 8,
        qualification: {
          degree: 'MA English Literature',
          university: 'Harvard',
          year: 2015
        }
      },
      {
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@school.edu',
        phone: '+1-555-0104',
        department: 'History',
        subjects: ['World History', 'American History', 'Geography'],
        experience: 10,
        qualification: {
          degree: 'MA History',
          university: 'Yale',
          year: 2013
        }
      }
    ];

    const createdTeachers = await Teacher.insertMany(teachers);
    console.log('👨‍🏫 Created teachers');

    // Create students
    const students = [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@student.edu',
        phone: '+1-555-1001',
        dateOfBirth: new Date('2006-03-15'),
        grade: '10-A',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701'
        },
        parentInfo: {
          name: 'Michael Smith',
          phone: '+1-555-2001',
          email: 'michael.smith@email.com',
          relationship: 'father'
        },
        gpa: 3.8,
        attendanceRate: 95
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@student.edu',
        phone: '+1-555-1002',
        dateOfBirth: new Date('2005-07-22'),
        grade: '11-B',
        address: {
          street: '456 Oak Ave',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62702'
        },
        parentInfo: {
          name: 'Lisa Johnson',
          phone: '+1-555-2002',
          email: 'lisa.johnson@email.com',
          relationship: 'mother'
        },
        gpa: 3.9,
        attendanceRate: 98
      },
      {
        firstName: 'Michael',
        lastName: 'Davis',
        email: 'michael.davis@student.edu',
        phone: '+1-555-1003',
        dateOfBirth: new Date('2007-11-08'),
        grade: '9-A',
        address: {
          street: '789 Pine St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62703'
        },
        parentInfo: {
          name: 'Robert Davis',
          phone: '+1-555-2003',
          email: 'robert.davis@email.com',
          relationship: 'father'
        },
        gpa: 3.6,
        attendanceRate: 87
      },
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@student.edu',
        phone: '+1-555-1004',
        dateOfBirth: new Date('2004-12-03'),
        grade: '12-A',
        address: {
          street: '321 Elm St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704'
        },
        parentInfo: {
          name: 'Jennifer Wilson',
          phone: '+1-555-2004',
          email: 'jennifer.wilson@email.com',
          relationship: 'mother'
        },
        gpa: 4.0,
        attendanceRate: 99
      }
    ];

    const createdStudents = await Student.insertMany(students);
    console.log('👨‍🎓 Created students');

    // Create courses
    const courses = [
      {
        title: 'Advanced Mathematics',
        description: 'Advanced mathematical concepts including calculus and statistics',
        department: 'Mathematics',
        teacher: createdTeachers[0]._id,
        credits: 4,
        duration: '1 Semester',
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          time: { start: '09:00', end: '10:30' },
          room: 'Math-101'
        },
        capacity: 30,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: [createdStudents[0]._id, createdStudents[1]._id]
      },
      {
        title: 'Organic Chemistry',
        description: 'Study of organic compounds and their reactions',
        department: 'Science',
        teacher: createdTeachers[1]._id,
        credits: 4,
        duration: '1 Semester',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: { start: '10:30', end: '12:00' },
          room: 'Sci-201'
        },
        capacity: 25,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: [createdStudents[1]._id, createdStudents[3]._id]
      },
      {
        title: 'World Literature',
        description: 'Exploration of literature from around the world',
        department: 'English',
        teacher: createdTeachers[2]._id,
        credits: 3,
        duration: '1 Semester',
        schedule: {
          days: ['Monday', 'Wednesday', 'Friday'],
          time: { start: '14:00', end: '15:30' },
          room: 'Eng-301'
        },
        capacity: 35,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: [createdStudents[0]._id, createdStudents[2]._id, createdStudents[3]._id]
      },
      {
        title: 'Modern World History',
        description: 'Study of world history from 1500 to present',
        department: 'History',
        teacher: createdTeachers[3]._id,
        credits: 3,
        duration: '1 Semester',
        schedule: {
          days: ['Tuesday', 'Thursday'],
          time: { start: '13:00', end: '14:30' },
          room: 'Hist-401'
        },
        capacity: 30,
        semester: 'Fall',
        year: 2024,
        enrolledStudents: [createdStudents[1]._id, createdStudents[2]._id]
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    console.log('📚 Created courses');

    // Update teacher and student course references
    for (let i = 0; i < createdTeachers.length; i++) {
      createdTeachers[i].courses.push(createdCourses[i]._id);
      await createdTeachers[i].save();
    }

    // Update student course references
    createdStudents[0].courses.push(createdCourses[0]._id, createdCourses[2]._id);
    createdStudents[1].courses.push(createdCourses[0]._id, createdCourses[1]._id, createdCourses[3]._id);
    createdStudents[2].courses.push(createdCourses[2]._id, createdCourses[3]._id);
    createdStudents[3].courses.push(createdCourses[1]._id, createdCourses[2]._id);

    await Promise.all(createdStudents.map(student => student.save()));

    // Create sample attendance records
    const attendanceRecords = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      // Create attendance for each student in each course
      createdCourses.forEach(course => {
        course.enrolledStudents.forEach(studentId => {
          const statuses = ['present', 'present', 'present', 'late', 'absent'];
          const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          attendanceRecords.push({
            student: studentId,
            course: course._id,
            date: date,
            status: randomStatus,
            timeIn: randomStatus !== 'absent' ? '08:15' : undefined,
            timeOut: randomStatus !== 'absent' ? '15:30' : undefined,
            recordedBy: adminUser._id
          });
        });
      });
    }

    await Attendance.insertMany(attendanceRecords);
    console.log('📅 Created attendance records');

    // Create sample grades
    const gradeRecords = [];
    const assignments = [
      { name: 'Midterm Exam', category: 'midterm', weight: 25 },
      { name: 'Quiz 1', category: 'quiz', weight: 10 },
      { name: 'Homework 1', category: 'homework', weight: 5 },
      { name: 'Final Project', category: 'project', weight: 30 },
      { name: 'Class Participation', category: 'participation', weight: 10 }
    ];

    createdCourses.forEach(course => {
      course.enrolledStudents.forEach(studentId => {
        assignments.forEach(assignment => {
          const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
          const maxScore = 100;
          
          gradeRecords.push({
            student: studentId,
            course: course._id,
            assignment: assignment.name,
            category: assignment.category,
            score: score,
            maxScore: maxScore,
            weight: assignment.weight,
            gradedBy: adminUser._id,
            isPublished: true,
            dueDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          });
        });
      });
    });

    await Grade.insertMany(gradeRecords);
    console.log('📊 Created grade records');

    console.log('🎉 Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Email: admin@school.edu');
    console.log('Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();