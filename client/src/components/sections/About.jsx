const About = () => {
  const stats = [
    { number: '500+', label: 'Happy Students', icon: '🎓' },
    { number: '50+', label: 'Expert Teachers', icon: '👨‍🏫' },
    { number: '15+', label: 'Years of Excellence', icon: '🏆' },
    { number: '98%', label: 'Success Rate', icon: '📈' }
  ];

  const achievements = [
    { title: 'CBSE Affiliation', description: 'Recognized by Central Board of Secondary Education' },
    { title: 'ISO Certified', description: 'Quality management system certification' },
    { title: 'Green School Award', description: 'Environmental sustainability recognition' },
    { title: 'Digital Learning Pioneer', description: 'Leading in educational technology adoption' }
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/8471824/pexels-photo-8471824.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="Modern school building with students"
                className="rounded-3xl shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent rounded-3xl"></div>
            </div>
            
            {/* Floating Achievement Badge */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-2xl shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-sm font-bold">Award Winning</div>
                <div className="text-xs">School 2024</div>
              </div>
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                <div className="text-sm text-gray-600 font-medium">Years of Educational Excellence</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🌟 About Plasma Pathways School
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Building Tomorrow's
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Leaders</span>
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Since 2008, Plasma Pathways School has been at the forefront of educational innovation, 
              providing exceptional learning experiences that prepare students for success in an 
              ever-evolving world. Our comprehensive curriculum seamlessly blends academic rigor 
              with character development.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              We believe every child possesses unique potential waiting to be unlocked. Our dedicated 
              faculty employs cutting-edge teaching methodologies and personalized attention to nurture 
              individual talents while building strong foundations across all subjects.
            </p>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                  <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold transform hover:scale-105 hover:shadow-xl">
              <span className="flex items-center space-x-2">
                <span>Discover Our Story</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{stat.icon}</span>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;