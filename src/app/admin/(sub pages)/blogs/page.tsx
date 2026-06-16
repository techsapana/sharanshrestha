"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/TipTap"), {
  ssr: false,
});

interface BlogForm {
  id?: number;
  title: string;
  content: string;
  image: File | null;
}

interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
}

const API_URL = "/api/blogs";

export default function AdminBlogForm() {
  const [form, setForm] = useState<BlogForm>({
    title: "",
    content: "",
    image: null,
  });
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Blog[] = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Please enter a title");
    if (!form.content.trim()) return alert("Please enter content");

    setSaving(true);

    const formData = new FormData();
    formData.append(
      "blog",
      JSON.stringify({
        id: form.id,
        title: form.title,
        content: form.content,
      }),
    );
    if (form.image) formData.append("image", form.image);

    try {
      await fetch(API_URL, {
        method: form.id ? "PUT" : "POST",
        body: formData,
      });
      alert(`Blog ${form.id ? "updated" : "saved"} successfully!`);
      setForm({ title: "", content: "", image: null });
      fetchBlogs();
    } catch (err) {
      console.error(err);
      alert("Failed to save blog");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setForm({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: null,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchBlogs(); // refresh list
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">
          Create / Edit Blog
        </h1>

        {/* Form */}
        <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm mb-8">
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Blog Title"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full mb-4 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />

          <RichTextEditor
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
          />

          {/* <textarea
            name="content"
            value={form.content}
            placeholder="Write your blog content here..."
            rows={10}
            onChange={handleChange}
            className="border-2 border-gray-300 p-4 w-full mb-4 rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          /> */}

          <div className="mb-4">
            <label className="font-semibold text-black block mb-2">
              Image:
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="border-2 border-gray-300 p-2 w-full rounded bg-white text-black"
            />
            {form.image && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {form.image.name}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full cursor-pointer text-white px-4 py-3 rounded font-semibold transition
              ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saving ? "Saving..." : form.id ? "Update Blog" : "Save Blog"}
          </button>
        </div>

        {/* Existing Blogs */}
        <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Existing Blogs</h2>
          {blogs.length === 0 && <p>No blogs available.</p>}
          {blogs?.map((blog) => (
            <div
              key={blog.id}
              className="border-b border-gray-200 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex flex-col">
                <p className="font-semibold">{blog.title}</p>
              </div>

              <div className="flex items-center gap-3">
                {blog.image ? (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    height={100}
                    width={160}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <p className="text-sm text-gray-500">No Image</p>
                )}

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(blog)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded font-medium"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(blog.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
