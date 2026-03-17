"use client";

import { useState, useEffect } from "react";

interface OnlineClassForm {
  id?: number;
  title: string;
  description: string;
  duration: string;
  link: string;
}

const API_URL = "/api/online-classes";

export default function AdminOnlineClassForm() {
  const [form, setForm] = useState<OnlineClassForm>({
    title: "",
    description: "",
    duration: "",
    link: "",
  });

  const [saving, setSaving] = useState(false);
  const [onlineClass, setOnlineClass] = useState<OnlineClassForm | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOnlineClass = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.exists && data.class) {
        setOnlineClass(data.class);
        setForm({
          id: data.class.id,
          title: data.class.title,
          description: data.class.description,
          duration: data.class.duration,
          link: data.class.link,
        });
      } else {
        setOnlineClass(null);
        setForm({ title: "", description: "", duration: "", link: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnlineClass();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (saving) return;

    if (!form.title.trim()) return alert("Please enter a title");
    if (!form.description.trim()) return alert("Please enter a description");
    if (!form.link.trim()) return alert("Please enter a link");

    try {
      setSaving(true);

      const method = onlineClass ? "PUT" : "POST";

      await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      alert(`Online class ${onlineClass ? "updated" : "saved"} successfully!`);

      fetchOnlineClass();
    } catch (err) {
      console.error(err);
      alert("Failed to save online class");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onlineClass) return;

    if (!confirm("Are you sure you want to delete this online class?")) return;

    try {
      setSaving(true);

      await fetch(API_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: onlineClass.id }),
      });

      alert("Online class deleted successfully!");
      setOnlineClass(null);
      setForm({ title: "", description: "", duration: "", link: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to delete online class");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white text-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold">Loading online class...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">
          Add / Edit Online Class
        </h1>

        <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Class Title"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <textarea
            name="description"
            value={form.description}
            placeholder="Class Description"
            rows={5}
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="duration"
            value={form.duration}
            placeholder="Duration (e.g., 1h 30m)"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="link"
            value={form.link}
            placeholder="Online Class Link"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full px-4 py-3 rounded font-semibold transition
              ${
                saving
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } text-white`}
          >
            {saving
              ? "Saving..."
              : onlineClass
                ? "Update Online Class"
                : "Save Online Class"}
          </button>

          {onlineClass && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="w-full cursor-pointer mt-2 px-4 py-3 rounded font-semibold bg-red-600 hover:bg-red-700 text-white transition"
            >
              {saving ? "Processing..." : "Delete Online Class"}
            </button>
          )}
        </div>

        {onlineClass && (
          <div className="mt-12 border-2 border-gray-300 p-6 rounded-lg bg-gray-50 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Available Online Class</h2>
            <p>
              <strong>Title:</strong> {onlineClass.title}
            </p>
            <p>
              <strong>Description:</strong> {onlineClass.description}
            </p>
            <p>
              <strong>Duration:</strong> {onlineClass.duration}
            </p>
            <p>
              <strong>Link:</strong>{" "}
              <a
                href={onlineClass.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 underline"
              >
                {onlineClass.link}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
