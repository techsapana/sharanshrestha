"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
}

export default function BlogPage() {
  const params = useParams<{ id?: string | string[] }>();
  const idParam = params?.id;
  const idValue = Array.isArray(idParam) ? idParam[0] : idParam;
  const blogId = idValue ? Number(idValue) : Number.NaN;
  const router = useRouter();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(blogId)) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${blogId}`);
        if (!res.ok) {
          setBlog(null);
          return;
        }
        const data: Blog = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-6 animate-pulse" />
        <div className="h-4 w-1/4 bg-gray-200 rounded mb-8 animate-pulse" />
        <div className="w-full max-w-5xl aspect-video bg-gray-200 rounded-2xl mb-8 animate-pulse" />
        <div className="space-y-4 w-full max-w-4xl">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-4 rounded bg-gray-200 animate-pulse ${
                idx % 2 === 0 ? "w-full" : "w-5/6"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-700 p-6">
        <p className="text-xl mb-4">Blog not found.</p>
        <button
          onClick={() => router.push("/blogs")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => router.push("/blogs")}
          className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-medium"
        >
          ← Back to Blogs
        </button>
      </div>

      {blog.image && (
        <div className="w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                sizes="(min-width: 1024px) 1024px, (min-width: 640px) 100vw, 100vw"
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-500 mb-8">
          {new Date(blog.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <article
          className="prose prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
