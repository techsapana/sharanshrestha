"use client";

import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  createdAt: string;
}

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch("/api/resources");
        if (!res.ok) return;
        const data: Resource[] = await res.json();
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const SkeletonCard = () => (
    <div className="border-b border-gray-200 pb-8 p-6 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Resources
          </h1>
          <p className="text-xl text-green-100">
            Download study notes, PDFs, and learning materials
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : resources.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No resources found
              </h2>
              <p className="text-gray-600">
                Resources will be added soon. Please check back later.
              </p>
            </div>
          ) : (
            resources.map((resource) => (
              <article
                key={resource.id}
                className="border-b border-gray-200 pb-8 shadow-xl hover:shadow-2xl transition-shadow p-6 rounded-lg"
              >
                <div className="mb-3">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {resource.title}
                  </h2>

                  <div className="flex items-center gap-4 flex-wrap mb-3">
                    <span className="text-sm text-gray-600">
                      {new Date(resource.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>

                {resource.description && (
                  <p className="text-gray-700 mb-4 text-lg line-clamp-3">
                    {resource.description}
                  </p>
                )}

                <a
                  href={resource.fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Check it out
                </a>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
