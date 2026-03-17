"use client";

import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  description?: string;
  fileUrl: string;
  createdAt?: string;
}

const API_URL = "/api/resources";

export default function AdminResourcesForm() {
  const [form, setForm] = useState({
    id: undefined as number | undefined,
    title: "",
    description: "",
    fileUrl: "",
  });

  const [resources, setResources] = useState<Resource[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    const res = await fetch(API_URL);
    const data: Resource[] = await res.json();
    setResources(data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResources();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (resource: Resource) => {
    setForm({
      id: resource.id,
      title: resource.title,
      description: resource.description || "",
      fileUrl: resource.fileUrl,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this resource?")) return;

    try {
      const res = await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        alert("Failed to delete resource. Please try again.");
        return;
      }

      alert("Resource deleted successfully!");
      fetchResources();
    } catch (error) {
      alert("An error occurred while deleting the resource.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Title required");
    if (!form.fileUrl.trim()) return alert("Google Drive link required");

    setSaving(true);

    const method = form.id ? "PUT" : "POST";

    await fetch(API_URL, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    alert(`Resource ${form.id ? "updated" : "created"}!`);

    setForm({ id: undefined, title: "", description: "", fileUrl: "" });
    fetchResources();
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Add / Edit Resource</h1>

        <div className="border-2 border-gray-300 p-6 rounded-lg space-y-4 mb-8">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border p-3 w-full rounded"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 w-full rounded"
          />

          <input
            name="fileUrl"
            value={form.fileUrl}
            onChange={handleChange}
            placeholder="Paste Google Drive link"
            className="border p-3 w-full rounded"
          />

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : form.id ? "Update" : "Save"}
          </button>
        </div>

        <div className="border-2 border-gray-300 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Existing Resources</h2>

          {resources.map((r) => (
            <div
              key={r.id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div onClick={() => handleEdit(r)} className="cursor-pointer">
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-gray-500">{r.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(r)}
                  className="bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors duration-200 text-white px-3 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 transition-colors duration-200 text-white px-3 py-2 rounded"
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
