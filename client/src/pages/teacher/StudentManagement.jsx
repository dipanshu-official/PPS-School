import { useEffect, useState } from 'react';
import StudentCard from '../../components/cards/StudentCard';
import StudentModal from '../../components/modals/StudentModal';
import {useDispatch, useSelector} from "react-redux"
import { allstudentDataSelector, deleteStudentDataSelector } from '../../store/globalSelctor';
import { getAllStudent } from '../../store/globalAction';


const StudentManagement = () => {
  const dispatch = useDispatch()
  const allStudent =useSelector(allstudentDataSelector)
  const deleteStudent = useSelector(deleteStudentDataSelector)
 

  const [editingStudent, setEditingStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(getAllStudent())
  }, [])
  

  const handleAdd = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setShowModal(true);
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
        {allStudent.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
           
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