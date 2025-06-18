import { useState } from 'react';
import StudentCard from '../../components/cards/StudentCard';
import StudentModal from '../../components/modals/StudentModal';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      firstName: 'Alex',
      lastName: 'Thompson',
      email: 'alex.thompson@student.plasmapathways.edu',
      password: 'student123',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      firstName: 'Emma',
      lastName: 'Johnson',
      email: 'emma.johnson@student.plasmapathways.edu',
      password: 'student456',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 3,
      firstName: 'Michael',
      lastName: 'Davis',
      email: 'michael.davis@student.plasmapathways.edu',
      password: 'student789',
      phone: '+1 (555) 345-6789'
    },
    {
      id: 4,
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@student.plasmapathways.edu',
      password: 'student101',
      phone: '+1 (555) 456-7890'
    },
    {
      id: 5,
      firstName: 'James',
      lastName: 'Brown',
      email: 'james.brown@student.plasmapathways.edu',
      password: 'student202',
      phone: '+1 (555) 567-8901'
    },
    {
      id: 6,
      firstName: 'Olivia',
      lastName: 'Garcia',
      email: 'olivia.garcia@student.plasmapathways.edu',
      password: 'student303',
      phone: '+1 (555) 678-9012'
    },
    {
      id: 7,
      firstName: 'William',
      lastName: 'Martinez',
      email: 'william.martinez@student.plasmapathways.edu',
      password: 'student404',
      phone: '+1 (555) 789-0123'
    },
    {
      id: 8,
      firstName: 'Sophia',
      lastName: 'Anderson',
      email: 'sophia.anderson@student.plasmapathways.edu',
      password: 'student505',
      phone: '+1 (555) 890-1234'
    }
  ]);

  const [editingStudent, setEditingStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  const handleSave = (studentData) => {
    if (editingStudent) {
      // Update existing student
      setStudents(students.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...studentData }
          : student
      ));
    } else {
      // Add new student
      const newStudent = {
        id: Math.max(...students.map(s => s.id)) + 1,
        ...studentData
      };
      setStudents([...students, newStudent]);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Management</h2>
          <p className="text-gray-600">Manage all students and their information</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Student</span>
        </button>
      </div>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <StudentModal
          student={editingStudent}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default StudentManagement;