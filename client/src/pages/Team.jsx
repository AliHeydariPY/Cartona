import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiX,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiCode,
  FiServer,
  FiHeart,
  FiAward,
  FiUsers,
  FiGlobe,
  FiMessageCircle,
  FiExternalLink,
} from "react-icons/fi";
import { FaReact, FaPython, FaDatabase, FaTelegram } from "react-icons/fa";
import {
  SiDjango,
  SiTailwindcss,
  SiJavascript,
  SiPostgresql,
  SiTypescript,
  SiMysql,
} from "react-icons/si";
import { GrMysql } from "react-icons/gr";
import { RiNextjsFill } from "react-icons/ri";
import { TbBrandNextjs } from "react-icons/tb";
import ScrollToTop from "../components/ScrollToTop";

const Team = () => {
  const [selectedDev, setSelectedDev] = useState(null);

  const developers = [
    {
      id: 1,
      name: "Adel Nouri",
      role: "Frontend Architect",
      bio: "Passionate about creating beautiful, responsive user interfaces with modern web technologies. Loves turning complex problems into elegant solutions.",
      fullBio: `With over 3 years of experience in frontend development, I specialize in building modern, scalable web applications. My passion lies in creating intuitive user experiences that blend aesthetics with functionality.

What drives me:
• Creating pixel-perfect, responsive designs
• Performance optimization and clean code
• Staying updated with latest frontend trends
• Collaborative problem-solving

When I'm not coding, you'll find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee while brainstorming new ideas.`,
      image: "../../public/profile/adelnouri.jpg",
      skills: [
        { name: "TypeScript", icon: SiTypescript, level: 90 },
        { name: "React", icon: FaReact, level: 95 },
        { name: "NextJS", icon: RiNextjsFill  , level: 88 },
        { name: "Tailwind CSS", icon: SiTailwindcss, level: 95 },
      ],
      social: {
        github: "https://github.com/AdelNouri",
        linkedin: "https://linkedin.com/in/alexthompson",
        telegram: "https://t.me/Vdel_Nouri",
        email: "adelnouri0231@gmail.com",
      },
      color: "from-blue-500 to-cyan-500",
      bgColor: "blue",
    },
    {
      id: 2,
      name: "Ali Heydari",
      role: "Backend Specialist",
      bio: "Expert in building robust, scalable backend systems. Enjoys architecting solutions that handle millions of requests with elegance and efficiency.",
      fullBio: `I have 3 years of experience in backend development, specializing in Python and Django. My expertise lies in creating secure, high-performance APIs and database architectures that scale seamlessly. 
 
My philosophy: 
• Write clean, maintainable code 
• Prioritize security and performance 
• Embrace agile methodologies 
• Continuous learning and improvement 
 
Outside of coding, I'm an avid computer knowledge reader, enjoy and love experimenting with new backend technologies. I believe great software is built through collaboration and attention to detail.`,
      image: "../../public/profile/aliheydari.png",
      skills: [
        { name: "Python", icon: FaPython, level: 94 },
        { name: "Django", icon: SiDjango, level: 92 },
        { name: "MySQL", icon: GrMysql, level: 89 },
        { name: "System Architecture", icon: FiServer, level: 91 },
      ],
      social: {
        github: "https://github.com/ali-heydari-py",
        linkedin: "https://linkedin.com/in/sarahchen",
        telegram: "https://t.me/sarahchen",
        email: "ahey6715@gmail.com",
      },
      color: "from-purple-500 to-pink-500",
      bgColor: "purple",
    },
  ];

  const projectStats = [
    { icon: FiCode, number: "25K+", label: "Lines of Code" },
    { icon: FiUsers, number: "2", label: "Expert Developers" },
    { icon: FiAward, number: "150+", label: "Features Delivered" },
    { icon: FiGlobe, number: "99.9%", label: "Uptime" },
  ];

  const techStack = [
    { name: "React", icon: FaReact, description: "Frontend Library" },
    { name: "Django REST", icon: SiDjango, description: "Backend Framework" },
    {
      name: "Tailwind CSS",
      icon: SiTailwindcss,
      description: "Styling Framework",
    },
    { name: "MySQL", icon: GrMysql, description: "Database" },
  ];

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Meet Our Team
            </motion.h1>
            <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
              We're a passionate duo of developers who believe in creating
              exceptional digital experiences. Together, we've built Cartona
              from the ground up with love, dedication, and cutting-edge
              technology.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {projectStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <stat.icon className="text-3xl mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-2xl font-bold text-blue-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-blue-600 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {developers.map((dev, index) => (
              <motion.div
                key={dev.id}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.6 }}
                className="group "
              >
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1.5">
                  <div
                    className={`bg-gradient-to-r ${dev.color} p-8 relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10 flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 p-1">
                          <img
                            src={dev.image}
                            alt={dev.name}
                            className="w-full h-full rounded-xl object-center"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                          {dev.id === 1 ? (
                            <FaReact className="text-blue-600 text-lg" />
                          ) : (
                            <SiDjango className="text-purple-600 text-lg" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {dev.name}
                        </h3>
                        <p className="text-blue-100 text-lg">{dev.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <p className="text-blue-800 leading-relaxed mb-6">
                      {dev.bio}
                    </p>

                    <div className="space-y-4 mb-6">
                      {dev.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            {skill.name == "MySQL" ? (
                              <skill.icon
                                strokeWidth={1}
                                className={`text-${dev.bgColor}-500 text-2xl mb-0.5`}
                              />
                            ) : (
                              <skill.icon
                                className={`text-${dev.bgColor}-500 text-2xl mb-0.5`}
                              />
                            )}
                            <span className="text-blue-700 font-medium">
                              {skill.name}
                            </span>
                          </div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-gradient-to-r ${dev.color} h-2 rounded-full transition-all duration-1000`}
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center space-x-4 mb-4">
                      {Object.entries(dev.social).map(([platform, url]) => {
                        const Icon =
                          platform === "github"
                            ? FiGithub
                            : platform === "linkedin"
                            ? FiLinkedin
                            : platform === "telegram"
                            ? FaTelegram
                            : FiMail;
                        return (
                          <a
                            key={platform}
                            href={platform === "email" ? `mailto:${url}` : url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`p-2 rounded-lg bg-${dev.bgColor}-100 text-${dev.bgColor}-600 hover:bg-${dev.bgColor}-200 transition-colors duration-300`}
                          >
                            <Icon size={18} />
                          </a>
                        );
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full bg-gradient-to-r ${dev.color} cursor-pointer text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2`}
                      onClick={() => setSelectedDev(dev)}
                    >
                      <span>View Full Profile</span>
                      <FiExternalLink size={16} className="mb-0.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-lg mb-16"
          >
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">
              Our Technology Stack
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                  className="text-center group"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl border border-blue-200 group-hover:border-blue-300 transition-all duration-300 group-hover:scale-105">
                    <tech.icon className="text-4xl mx-auto mb-3 text-blue-600" />
                    <h3 className="font-bold text-blue-900 mb-1">
                      {tech.name}
                    </h3>
                    <p className="text-blue-600 text-sm">{tech.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4">
                  Let's Build Something Amazing Together
                </h2>
                <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
                  Have a project in mind? Want to collaborate? We're always
                  excited to hear about new opportunities and challenges.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="mailto:hello@cartona.com"
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <FiMail />
                    <span>Email Us</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="https://t.me/cartona_support"
                    className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                  >
                    <FaTelegram />
                    <span>Telegram</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-lg">
              <FiHeart className="text-4xl text-rose-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Built with Passion
              </h3>
              <p className="text-blue-700 text-lg max-w-2xl mx-auto">
                Every line of code, every design decision, and every feature in
                Cartona is crafted with care, attention to detail, and a genuine
                love for creating exceptional user experiences.
              </p>
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {selectedDev && (
            <DeveloperModal
              developer={selectedDev}
              onClose={() => setSelectedDev(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

const DeveloperModal = ({ developer, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-gradient-to-r ${developer.color} p-8 relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 p-1">
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="w-full h-full rounded-xl object-center"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                  {developer.id === 1 ? (
                    <FaReact className="text-blue-600 text-xl" />
                  ) : (
                    <SiDjango className="text-purple-600 text-xl" />
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {developer.name}
                </h2>
                <p className="text-xl text-blue-100">{developer.role}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 bg-white/25 rounded-xl hover:bg-white/35 transition-colors duration-200"
            >
              <FiX className="text-white" size={20} />
              {/* <FiX className="text-white text-xl" /> */}
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                About Me
              </h3>
              <div className="prose prose-blue max-w-none">
                {developer.fullBio.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-blue-800 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-3">
                  Technical Skills
                </h4>
                <div className="space-y-3">
                  {developer.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <skill.icon
                          className={`text-${developer.bgColor}-500 text-xl`}
                        />
                        <span className="text-blue-700">{skill.name}</span>
                      </div>
                      <span className="text-blue-600 font-medium">
                        {skill.level}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-3">
                  Get In Touch
                </h4>
                <div className="space-y-3">
                  <a
                    href={developer.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 hover:text-${developer.bgColor}-700 text-${developer.bgColor}-600  transition-colors p-2 rounded-lg hover:bg-${developer.bgColor}-100`}
                  >
                    <FiGithub className="text-lg" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={developer.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 hover:text-${developer.bgColor}-700 text-${developer.bgColor}-600 transition-colors p-2 rounded-lg hover:bg-${developer.bgColor}-100`}
                  >
                    <FiLinkedin className="text-lg" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={developer.social.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 hover:text-${developer.bgColor}-700 text-${developer.bgColor}-600 transition-colors p-2 rounded-lg hover:bg-${developer.bgColor}-100`}
                  >
                    <FaTelegram className="text-lg" />
                    <span>Telegram</span>
                  </a>
                  <a
                    href={`mailto:${developer.social.email}`}
                    className={`flex items-center space-x-3 hover:text-${developer.bgColor}-700 text-${developer.bgColor}-600 transition-colors p-2 rounded-lg hover:bg-${developer.bgColor}-100`}
                  >
                    <FiMail className="text-lg" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Team;
