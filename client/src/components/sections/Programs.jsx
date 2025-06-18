const Programs = () => {
  const programs = [
    {
      grade: "Grades 1-2",
      title: "Foundation Years",
      description: "Building essential literacy and numeracy skills through play-based learning and creative activities.",
      subjects: ["English", "Mathematics", "Science", "Art", "Physical Education"],
      color: "from-red-400 to-pink-500"
    },
    {
      grade: "Grades 3-5",
      title: "Elementary Program",
      description: "Developing critical thinking and problem-solving skills across core academic subjects.",
      subjects: ["English", "Mathematics", "Science", "Social Studies", "Computer Science"],
      color: "from-blue-400 to-indigo-500"
    },
    {
      grade: "Grades 6-8",
      title: "Middle School",
      description: "Preparing students for advanced learning with specialized subject focus and leadership opportunities.",
      subjects: ["Advanced Math", "Physics", "Chemistry", "Biology", "Literature", "History"],
      color: "from-green-400 to-teal-500"
    },
    {
      grade: "Grades 9-10",
      title: "High School Prep",
      description: "Comprehensive preparation for board examinations and future academic endeavors.",
      subjects: ["Advanced Sciences", "Mathematics", "English Literature", "Economics", "Computer Applications"],
      color: "from-purple-400 to-violet-500"
    }
  ];

  return (
    <section id="programs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Academic Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive curriculum is designed to meet the unique needs of each grade level, 
            ensuring steady progression and academic excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`h-32 bg-gradient-to-r ${program.color} p-6 flex items-center justify-center`}>
                <div className="text-center text-white">
                  <h3 className="text-lg font-bold mb-1">{program.grade}</h3>
                  <p className="text-sm opacity-90">{program.title}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {program.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm">Key Subjects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.subjects.map((subject, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm font-medium">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;