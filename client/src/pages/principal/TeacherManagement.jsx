import { useEffect, useState } from "react";
import TeacherCard from "../../components/cards/TeacherCard";
import TeacherModal from "../../components/modals/TeacherModal";
import { useDispatch, useSelector } from "react-redux";
import { allteacherDataSelector } from "../../store/globalSelctor";
import { getAllTeacher } from "../../store/globalAction";

const TeacherManagement = () => {

  
  const dispatch = useDispatch();
  const allTeacher = useSelector(allteacherDataSelector);
  console.log("allTeacher =>", allTeacher);

  useEffect(() => {
    dispatch(getAllTeacher());
  }, []);

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAdd = () => {
    setEditingTeacher(null);
    setShowModal(true);
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setShowModal(true);
  };

  const handleDelete = (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      (allTeacher.filter((teacher) => teacher.id !== teacherId));
    }
  };

  const handleSave = (teacherData) => {
    if (editingTeacher) {
      // Update existing teacher
      allTeacher(
        teachers.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...teacherData }
            : teacher
        )
      );
    } else {
      // Add new teacher
      const newTeacher = {
        id: Math.max(...teachers.map((t) => t.id)) + 1,
        ...teacherData,
      };
      ([...allTeacher, newTeacher]);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingTeacher(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Teacher Management
          </h2>
          <p className="text-gray-600">
            Manage all teachers and their information
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold flex items-center space-x-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Teachers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTeacher.map((teacher) => (
          <TeacherCard
            key={teacher._id}
            teacher={teacher}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <TeacherModal
          teacher={editingTeacher}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default TeacherManagement;
