import React, { useState } from 'react';
import about_us from '../assets/about_us.jpg';

function About_us_hero() {
  const sections = [
    {
      id: 'mission',
      title: 'Who We Are',
      content: '',
    },
    {
      id: 'team',
      title: 'Our Project',
      content: '',
    },
    {
      id: 'values',
      title: 'Why We Built This',
      content: '',
    },
    {
      id: 'Team Contributions',
      title: 'Team Contributions'
    }
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div>
      {/* Hero Section */}
      <div className="flex relative h-[500px] w-full overflow-hidden justify-center items-center">
        <h1 className="text-7xl mb-28 font-bold italic text-[#00008B] z-10">#VANNI</h1>
        <img
          src={about_us}
          alt="About us background"
          className="absolute bottom-[-350px] w-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col md:flex-row p-6 gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`block w-full text-left px-4 py-2 rounded transition duration-300 ${activeSection === section.id
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
                }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content Display */}
        <div className="md:w-3/4 p-6 border-l border-gray-300">
          {activeSection === 'mission' && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Who We Are</h2>
              <p className="text-lg text-gray-700">
                We are a team of four passionate B.Tech students from the Information Technology department,
                united by our shared interest in deep learning and assistive technologies. Our mission is to bridge
                communication gaps using technology.
              </p>
            </div>
          )}

          {activeSection === 'team' && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Our Project</h2>
              <p className="text-lg text-gray-700">
                This project is a Hand Sign Language Detection System that uses deep learning (CNN and LSTM)
                to recognize hand signs of alphabets and convert them into readable text. It's designed to assist
                individuals with hearing or speech impairments in real-time communication.
              </p>
            </div>
          )}

          {activeSection === 'values' && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Our Values</h2>
              <p className="text-lg text-gray-700">We believe that technology should be inclusive. Our aim was to create a tool that makes communication easier and more accessible for everyone, especially those who rely on sign language.
              </p>
            </div>
          )}
          {activeSection === 'Team Contributions' && (
            <div>
              <h2 className="text-3xl font-bold mb-4 text-blue-800">Team Contributions</h2>
              <h2 className='text-blue-800 text-2xl'>Technology Used:</h2>
              <ul className="list-disc list-inside text-gray-700 text-xl space-y-1">
                <li>Python, NumPy, OpenCV</li>
                <li>TensorFlow/Keras (CNN, LSTM)</li>
                <li>Google Colab, Google Drive</li>
                <li>Streamlit/Flask (for web interface)</li>
                <li>Git, GitHub (for collaboration)</li>
              </ul>

              <div class="text-sm grid grid-cols-4 gap-4 p-5">
                <figure class="relative flex flex-col-reverse bg-slate-100 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                  <blockquote class="mt-6 text-center text-slate-700 dark:text-slate-300">
                    <p>I may not show it but i cant live without</p>
                  </blockquote>
                  <figcaption class="flex flex-col items-center">
                    <img src="https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxjb2RlcnxlbnwwfDB8fHwxNzEwMTY0NjIzfDA&ixlib=rb-4.0.3&q=80&w=1080" alt="" class="flex-none w-14 h-14 rounded-full object-cover"/>
                      <div class="flex-auto text-center">
                        <div class="text-base text-slate-900 font-semibold dark:text-slate-200">
                          John Doe
                        </div>
                        <div class="mt-0.5 dark:text-slate-300">
                          Web Developer
                        </div>
                      </div>
                  </figcaption>
                </figure>
                <figure class="relative flex flex-col-reverse bg-slate-100 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                  <blockquote class="mt-6 text-center text-slate-700 dark:text-slate-300">
                    <p>I may not show it but i cant live without</p>
                  </blockquote>
                  <figcaption class="flex flex-col items-center">
                    <img src="https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxjb2RlcnxlbnwwfDB8fHwxNzEwMTY0NjIzfDA&ixlib=rb-4.0.3&q=80&w=1080" alt="" class="flex-none w-14 h-14 rounded-full object-cover"/>
                      <div class="flex-auto text-center">
                        <div class="text-base text-slate-900 font-semibold dark:text-slate-200">
                          John Doe
                        </div>
                        <div class="mt-0.5 dark:text-slate-300">
                          Web Developer
                        </div>
                      </div>
                  </figcaption>
                </figure>
                <figure class="relative flex flex-col-reverse bg-slate-100 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                  <blockquote class="mt-6 text-center text-slate-700 dark:text-slate-300">
                    <p>I may not show it but i cant live without</p>
                  </blockquote>
                  <figcaption class="flex flex-col items-center">
                    <img src="https://images.unsplash.com/photo-1632910121591-29e2484c0259?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw4fHxjb2RlcnxlbnwwfDB8fHwxNzEwMTY0NjIzfDA&ixlib=rb-4.0.3&q=80&w=1080" alt="" class="flex-none w-14 h-14 rounded-full object-cover"/>
                      <div class="flex-auto text-center">
                        <div class="text-base text-slate-900 font-semibold dark:text-slate-200">
                          John Doe
                        </div>
                        <div class="mt-0.5 dark:text-slate-300">
                          Web Developer
                        </div>
                      </div>
                  </figcaption>
                </figure>
                <figure class="relative flex flex-col-reverse bg-slate-100 rounded-lg p-6 dark:bg-slate-800 dark:highlight-white/5">
                  <blockquote class="mt-6 text-center text-slate-700 dark:text-slate-300">
                    <p>I may not show it but i cant live without</p>
                  </blockquote>
                  <figcaption class="flex flex-col items-center">
                    <img src="" alt="" class="flex-none w-14 h-14 rounded-full object-cover"/>
                      <div class="flex-auto text-center">
                        <div class="text-base text-slate-900 font-semibold dark:text-slate-200">
                          John Doe
                        </div>
                        <div class="mt-0.5 dark:text-slate-300">
                          Web Developer
                        </div>
                      </div>
                  </figcaption>
                </figure>
                
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default About_us_hero;
