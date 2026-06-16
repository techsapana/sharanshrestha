"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

import Image from "next/image";
import Footer from "@/components/Footer";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import {
  fadeLeft,
  fadeRight,
  fadeUp,
  fadeUpItem,
  staggerContainer,
  scrollingButton,
} from "@/animations/animation";

export default function Home() {
  const controls = useAnimationControls();

  const [hasClass, setHasClass] = useState<boolean>(false);
  const [classLink, setClassLink] = useState<string>("");
  const [classTitle, setClassTitle] = useState<string>("");
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    fetch("/api/online-classes")
      .then((res) => res.json())
      .then((data) => {
        if (data.exists && data.class?.link) {
          setHasClass(true);
          setClassLink(data.class.link);
          setClassTitle(data.class.title);
        } else {
          setHasClass(false);
        }
      });
  }, []);

  useEffect(() => {
    if (hasClass && !isHovering) {
      controls.start("moveRight");
    } else {
      controls.stop();
    }
  }, [hasClass, isHovering, controls]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 relative">
      <section className="pt-24 pb-20 px-6 bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <motion.div variants={fadeLeft} initial="hidden" animate="visible">
              <div className="w-72 h-72 rounded-full overflow-hidden shadow-xl">
                <Image
                  src="/profile.jpeg"
                  alt="Sharan Shrestha"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>

          <motion.div variants={fadeRight} initial="hidden" animate="visible">
            <div>
              <h1 className="text-5xl font-bold mb-4">Sharan Shrestha</h1>

              <p className="text-xl text-gray-600 mb-2">
                Lecturer — Department of Management
              </p>

              <p className="text-gray-700 mb-6">
                Drabya Shah Multiple Campus, Gorkha
              </p>

              <p className="text-gray-600 mb-8">
                Passionate educator and researcher specializing in Accounting
                Information Systems, General Management, and Entrepreneurship.
              </p>

              <Link
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {hasClass && (
        <div className="py-8 px-6 overflow-hidden">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={scrollingButton}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="w-fit"
          >
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <p className="text-xs md:text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
                {classTitle}
              </p>
              <a
                href={classLink}
                target="_blank"
                className="inline-block px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition font-semibold"
              >
                Join Now
              </a>
            </div>
          </motion.div>
        </div>
      )}

      <section id="qualifications" className="bg-gray-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-3xl font-bold mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Qualifications
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-4">
              {[
                [
                  "M.Phil. in Accountancy",
                  "Tribhuvan University",
                  "CGPA: 3.83",
                  "2023",
                ],
                [
                  "MBS in Accountancy",
                  "Tribhuvan University",
                  "First Division (71.6%)",
                  "2009",
                ],
                [
                  "BBS (Accountancy & Finance)",
                  "Tribhuvan University",
                  "Second Division",
                  "2005",
                ],
                ["PCL", "Tribhuvan University", "Second Division", "2002"],
                ["SLC", "Nepal Board", "Second Division", "2000"],
              ].map((q, i) => (
                <motion.div
                  key={i}
                  variants={fadeUpItem}
                  className="bg-white p-5 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-lg">{q[0]}</h3>
                  <p className="text-gray-600">
                    {q[1]} • {q[2]} • {q[3]}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="experience" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold mb-16 text-center"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Professional Experience
          </motion.h2>

          <motion.div
            className="relative border-l-2 border-indigo-200 ml-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                role: "Acting Campus Chief",
                period: "Mar 2024 – May 2024",
              },
              {
                role: "Assistant Campus Chief",
                period: "2023 – 2024",
              },
              {
                role: "Lecturer",
                period: "2019 – Present",
              },
              {
                role: "Assistant Lecturer",
                period: "2011 – 2019",
              },
              {
                role: "+2 Level Teacher",
                period: "2007 – 2011",
              },
            ].map((job, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="mb-12 ml-6 relative group"
              >
                <span className="absolute -left-8.5 flex items-center justify-center w-6 h-6 bg-indigo-600 rounded-full ring-8 ring-slate-50 group-hover:scale-110 transition" />

                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 group-hover:shadow-xl transition duration-300">
                  <h3 className="text-lg font-semibold">{job.role}</h3>

                  <p className="text-indigo-600 font-medium">{job.period}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="engagements" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-extrabold mb-20 text-center text-gray-900 tracking-tight"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            Professional Engagements & Academic Development
          </motion.h2>

          <motion.div
            className="relative"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-indigo-200 via-indigo-400 to-indigo-200"></div>

            <div className="space-y-16 md:space-y-24">
              {[
                {
                  title: "Memberships & Roles",
                  bg: "bg-gradient-to-br from-slate-50 to-slate-100",
                  borderColor: "border-indigo-200",
                  content: (
                    <ul className="space-y-4 text-gray-800 text-lg leading-relaxed list-disc list-inside">
                      <li>
                        Member, Account Subject Committee, TU (2073-02-01)
                      </li>
                      <li>
                        Treasurer, Sarokar Saving and Credit Co-operative Ltd.,
                        Gorkha
                      </li>
                      <li>Member, Heads Nepal</li>
                      <li>
                        Member, Rotary Club of Gorkha
                        <span className="block text-gray-600 text-base">
                          (RI District 3292, Club ID 60435)
                        </span>
                      </li>
                    </ul>
                  ),
                },
                {
                  title: "Workshops & Training",
                  bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
                  borderColor: "border-blue-200",
                  content: (
                    <ul className="space-y-4 text-gray-800 text-base leading-relaxed list-disc list-inside">
                      <li>
                        Faculty Training, Aadikavi Bhanubhakta Campus (UGC),
                        <span className="block text-gray-600">
                          May 17–23, 2082
                        </span>
                      </li>
                      <li>
                        International FDP on Data Analysis for Multidisciplinary
                        Research
                        <span className="block text-gray-600">
                          (April 2025)
                        </span>
                      </li>
                      <li>
                        Advanced Data Analysis (SEM using SmartPLS 4.0), Dec
                        2024
                      </li>
                      <li>
                        3-Day Workshop on Data Collection & Analysis (UGC–DMC)
                      </li>
                      <li>
                        Journal Article Writing, ICT in Education, Research
                        Proposal & Academic Writing
                        <span className="block text-gray-600">(2014–2019)</span>
                      </li>
                      <li>Research Analytics using R, AMOS & STATA, TU</li>
                      <li>CDM Faculty Development Program (2021)</li>
                    </ul>
                  ),
                },
                {
                  title: "Conference Participation",
                  bg: "bg-gradient-to-br from-purple-50 to-pink-50",
                  borderColor: "border-purple-200",
                  content: (
                    <ul className="space-y-4 text-gray-800 text-base leading-relaxed list-disc list-inside">
                      <li>
                        National Conference 2025 – Marsyangdi Multiple Campus,
                        Besishahar
                        <span className="block text-gray-600 text-sm">
                          27–28 Baishakh 2082 (10–11 May 2025)
                        </span>
                      </li>
                      <li>
                        4th International Conference on Global Innovations in
                        Management & Social Sciences
                        <span className="block text-gray-600 text-sm">
                          November 2024
                        </span>
                      </li>
                      <li>
                        International Conference on Sustainable Business &
                        Management
                        <span className="block text-gray-600 text-sm">
                          July 2024
                        </span>
                      </li>
                      <li>
                        National Conference on Challenges in Higher Education,
                        Makawanpur Multiple Campus
                        <span className="block text-gray-600 text-sm">
                          11–12 Jestha 2081 (24–25 May 2024)
                        </span>
                      </li>
                    </ul>
                  ),
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpItem}
                  className={`relative flex items-start
                    ${
                      idx % 2 === 0
                        ? "md:flex-row md:justify-start"
                        : "md:flex-row-reverse md:justify-start"
                    }
                  `}
                >
                  <div
                    className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 
                    w-5 h-5 rounded-full bg-indigo-600 border-4 border-white shadow-lg
                    z-10 flex items-center justify-center
                    group-hover:scale-125 transition-transform duration-300
                  `}
                  >
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>

                  <div
                    className={`
                    ml-20 md:ml-0 md:w-[calc(50%-3rem)]
                    ${idx % 2 === 0 ? "md:mr-16" : "md:ml-16"}
                  `}
                  >
                    <div
                      className={`
                      ${item.bg} ${item.borderColor}
                      rounded-2xl p-8 shadow-md hover:shadow-xl 
                      transition-all duration-300 border-2
                      transform hover:-translate-y-1
                      group
                    `}
                    >
                      <div
                        className={`
                        hidden md:block absolute top-2.5 w-8 h-0.5 bg-indigo-300
                        ${idx % 2 === 0 ? "right-full mr-5" : "left-full ml-5"}
                      `}
                      ></div>

                      <h3 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-3">
                        <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
                        {item.title}
                      </h3>
                      {item.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className="absolute left-8 md:left-1/2 transform -translate-x-1/2 bottom-0 
              w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 
              border-4 border-white shadow-lg flex items-center justify-center"
            >
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-linear-to-b from-gray-50 to-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Research & Publications
              </h2>
              <p className="text-gray-600 mt-3 text-lg max-w-2xl">
                Selected scholarly works focusing on accounting systems,
                taxation, entrepreneurship, and organizational performance.
              </p>
            </div>

            <Link
              href="/researches"
              className="mt-6 md:mt-0 inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              View All Research →
            </Link>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {[
              {
                title:
                  "Impact of Accounting Information System on Organization Performance of Co-operatives of Nepal",
                year: "2024",
              },
              {
                title: "Women Entrepreneurs' Success in Gorkha Municipality",
                year: "2022",
              },
            ].map((research, i) => (
              <motion.div
                key={i}
                variants={fadeUpItem}
                className="group bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold text-gray-900 leading-snug">
                    {research.title}
                  </h3>

                  {research.year && (
                    <span className="shrink-0 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {research.year}
                    </span>
                  )}
                </div>

                <div className="mt-5 h-1 w-10 bg-indigo-600 rounded group-hover:w-16 transition-all"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <Link
              href="/researches"
              className="inline-block bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              Explore All Publications
            </Link>
          </motion.div>
        </div>
      </section>

      <section
        id="contact"
        className="py-20 px-6 bg-linear-to-br from-indigo-50 via-blue-50 to-slate-50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Get in Touch
            </h2>
            <p className="text-lg text-slate-600">
              Feel free to reach out for academic collaborations, consultations,
              or inquiries
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 items-stretch"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              variants={fadeUpItem}
              className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    className="w-7 h-7 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Office Location
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xl font-semibold text-indigo-600 mb-2">
                    Drabya Shah Multiple Campus
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Gorkha Municipality-9, Laxmibazar
                    <br />
                    Gorkha, Nepal
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-600 mb-3">Office Hours</p>
                  <p className="text-slate-700">
                    Sunday - Friday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUpItem}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full"
            >
              <iframe
                src="https://maps.google.com/maps?q=Drabya%20Shah%20Multiple%20Campus%20Gorkha&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                className="w-full h-full border-0 min-h-90"
                title="Campus Location Map"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link
          href="https://wa.me/9779846378214"
          target="_blank"
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg inline-flex"
        >
          <FaWhatsapp size={28} />
        </Link>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
