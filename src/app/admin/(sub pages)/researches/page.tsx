"use client";

import { useState, useEffect } from "react";

interface ResearchForm {
  id?: number;
  title: string;
  journal?: string;
  year?: string;
  doi?: string;
  tags: string;
}

interface ResearchArticle {
  id: number;
  title: string;
  journal?: string;
  year?: number;
  doi?: string;
  tags: string[];
}

const API_URL = "/api/researches";

export default function AdminResearchForm() {
  const [form, setForm] = useState<ResearchForm>({
    title: "",
    journal: "",
    year: "",
    doi: "",
    tags: "",
  });

  const [articles, setArticles] = useState<ResearchArticle[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch(API_URL);
      const data: ResearchArticle[] = await res.json();
      setArticles(data);
    } catch (err) {
      console.error("Failed to fetch articles", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEdit = (article: ResearchArticle) => {
    setForm({
      id: article.id,
      title: article.title,
      journal: article.journal || "",
      year: article.year?.toString() || "",
      doi: article.doi || "",
      tags: article.tags.join(", "),
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to delete article", err);
      alert("Failed to delete article");
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert("Please enter a title");

    setSaving(true);
    try {
      const payload = {
        title: form.title,
        journal: form.journal || null,
        year: form.year ? Number(form.year) : null,
        doi: form.doi || null,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${API_URL}/${form.id}` : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      alert(`Article ${form.id ? "updated" : "created"} successfully!`);
      setForm({ title: "", journal: "", year: "", doi: "", tags: "" });
      fetchArticles();
    } catch (err) {
      console.error(err);
      alert("Failed to save article");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">
          Add / Edit Research Article
        </h1>

        <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm mb-8 space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            placeholder="Article Title"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="journal"
            value={form.journal}
            placeholder="Journal (optional)"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="year"
            value={form.year}
            placeholder="Year (optional)"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="doi"
            value={form.doi}
            placeholder="DOI (optional)"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            name="tags"
            value={form.tags}
            placeholder="Tags (comma-separated)"
            onChange={handleChange}
            className="border-2 border-gray-300 p-3 w-full rounded bg-white text-black placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={handleSubmit}
            className={`w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-semibold transition ${
              saving ? "opacity-60 cursor-not-allowed" : ""
            }`}
            disabled={saving}
          >
            {saving ? "Saving..." : form.id ? "Update Article" : "Save Article"}
          </button>
        </div>

        <div className="border-2 border-gray-300 p-6 rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Existing Articles</h2>
          {articles.length === 0 && <p>No articles available.</p>}
          {articles.map((article) => (
            <div
              key={article.id}
              className="border-b border-gray-200 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer"
            >
              <div onClick={() => handleEdit(article)}>
                <p className="font-semibold">{article.title}</p>
                {article.journal && (
                  <p className="text-gray-500 text-sm">{article.journal}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(article.id)}
                className="cursor-pointer p-4 bg-red-500 rounded-4xl text-white font-bold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
