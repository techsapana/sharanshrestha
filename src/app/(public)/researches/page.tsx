"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ResearchArticle {
  id: number;
  title: string;
  journal?: string;
  year?: number | null;
  doi?: string;
  tags: string[];
}

export default function Researches() {
  const [researches, setResearches] = useState<ResearchArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResearches() {
      try {
        const res = await fetch("/api/researches");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch researches");
        }
        const data = await res.json();
        setResearches(data.reverse());
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong while fetching researches");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchResearches();
  }, []);

  const SkeletonArticle = () => (
    <div className="border border-gray-200 rounded-2xl p-7 animate-pulse space-y-4 bg-white">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        <div className="h-6 bg-gray-300 rounded-full w-24"></div>
      </div>
      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Research & Publications
          </h1>
          <p className="text-xl text-emerald-100">
            Peer-reviewed publications and research contributions
          </p>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            Research Interests
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              "Accounting Information System",
              "General Management",
              "Entrepreneurship",
            ].map((interest) => (
              <span
                key={interest}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="space-y-8"
          >
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonArticle key={i} />
              ))
            ) : error ? (
              <div className="text-red-600 font-semibold text-center py-10">
                {error}
              </div>
            ) : (
              researches.map((research) => (
                <motion.article
                  key={research.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45 }}
                  className="border border-gray-200 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition bg-white"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 leading-snug mb-3">
                    {research.title}
                  </h2>

                  <div className="text-gray-600 mb-4">
                    <span className="italic">{research.journal}</span>
                    {research.year && <> • {research.year}</>}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {research.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {research.doi && (
                    <a
                      href={research.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-emerald-600 font-semibold hover:underline"
                    >
                      View Publication →
                    </a>
                  )}
                </motion.article>
              ))
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
