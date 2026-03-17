"use client";

import { useState, useEffect } from "react";

interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data: Blog[] = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const SkeletonCard = () => (
    <div className="border-b border-gray-200 pb-8 p-6 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-blue-100">
            Thoughts on education, teaching, and learning
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                No blogs found
              </h2>
              <p className="text-gray-600">
                There are no blog posts available yet. Please check back later.
              </p>
            </div>
          ) : (
            blogs.map((blog) => (
              <article
                key={blog.id}
                className="border-b border-gray-200 pb-8 hover:shadow-lg transition-shadow p-6 rounded-lg"
              >
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {blog.title}
                    </h2>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-sm text-gray-600">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="text-gray-700 mb-4 text-lg prose max-w-none line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: stripHtml(blog.content).slice(0, 150),
                  }}
                />

                <a
                  href={`/blogs/${blog.id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Read Full Article →
                </a>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
