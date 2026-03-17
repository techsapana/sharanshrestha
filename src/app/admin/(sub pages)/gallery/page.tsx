"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface GalleryForm {
  id?: number;
  title: string;
  images: File[];
}

interface GalleryImage {
  id: number;
  url: string;
  galleryId: number;
}

interface Gallery {
  id: number;
  title: string;
  images: GalleryImage[];
}

const API_URL = "/api/gallery";

export default function AdminGalleryForm() {
  const [form, setForm] = useState<GalleryForm>({
    title: "",
    images: [],
  });

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      // Check if response is an array
      if (Array.isArray(data)) {
        setGalleries(data);
      } else {
        console.error("Invalid response format:", data);
        setGalleries([]);
      }
    } catch (err) {
      console.error("Failed to fetch galleries", err);
      setGalleries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, title: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm({ ...form, images: Array.from(e.target.files) });
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Enter title");
    if (form.images.length === 0 && !form.id) return alert("Select images");

    setSaving(true);

    const formData = new FormData();
    formData.append(
      "gallery",
      JSON.stringify({
        id: form.id,
        title: form.title,
      }),
    );

    form.images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await fetch(API_URL, {
        method: form.id ? "PUT" : "POST",
        body: formData,
      });

      alert(`Gallery ${form.id ? "updated" : "created"}!`);
      setForm({ title: "", images: [] });
      fetchGalleries();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setForm({
      id: gallery.id,
      title: gallery.title,
      images: [],
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this gallery?")) return;

    try {
      await fetch(`${API_URL}?id=${id}`, {
        method: "DELETE",
      });
      fetchGalleries();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Create / Edit Gallery</h1>

        {/* FORM */}
        <div className="border p-6 rounded-lg shadow-sm mb-8">
          <input
            type="text"
            placeholder="Gallery Title"
            value={form.title}
            onChange={handleTitleChange}
            className="border p-3 w-full mb-4 rounded"
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="border p-2 w-full mb-2 rounded"
          />

          {form.images.length > 0 && (
            <p className="text-sm text-gray-600">
              {form.images.length} image(s) selected
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className={`w-full mt-4 text-white cursor-pointer py-3 rounded font-semibold
              ${saving ? "bg-gray-400 disabled:cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {saving ? "Saving..." : form.id ? "Update Gallery" : "Save Gallery"}
          </button>
        </div>

        {/* LIST */}
        <div className="border p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Existing Galleries</h2>

          {loading ? (
            <div className="space-y-4">
              {/* Loading Skeleton */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b py-4 flex justify-between items-center animate-pulse"
                >
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                      <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                    <div className="w-16 h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <p>No galleries</p>
          ) : (
            galleries.map((gallery) => (
              <div
                key={gallery.id}
                className="border-b py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{gallery.title}</p>

                  <div className="flex gap-2 mt-2">
                    {gallery.images?.map((img) => (
                      <Image
                        key={img.id}
                        src={img.url}
                        alt=""
                        width={80}
                        height={80}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(gallery)}
                    className="bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(gallery.id)}
                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
