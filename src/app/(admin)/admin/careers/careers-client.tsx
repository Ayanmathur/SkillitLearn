"use client";

import { useState } from "react";
import Link from "next/link";
import { createCareer, deleteCareer } from "../actions/career-actions";

interface Career {
  id: string;
  name: string;
  slug: string;
  description: string;
  pathCount: number;
}

export function AdminCareersClient({ careers }: { careers: Career[] }) {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = careers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search.toLowerCase())
  );

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Auto-generate slug from name if not provided
    if (!fd.get("slug")) {
      fd.set("slug", (fd.get("name") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
    const result = await createCareer(fd);
    if (result?.error) setError(result.error);
    else { setShowForm(false); window.location.reload(); }
    setLoading(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete career "${name}"? This cannot be undone.`)) return;
    const result = await deleteCareer(id);
    if (result?.error) alert(result.error);
    else window.location.reload();
  }

  return (
    <div>
      {/* Search + Create */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search careers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-surface border border-[var(--border-color)] text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all"
        >
          {showForm ? "Cancel" : "+ New Career"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <h3 className="font-bold text-text-primary">Create New Career</h3>
          {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</div>}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Name *</label>
              <input name="name" required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Slug (auto-generated)</label>
              <input name="slug" placeholder="auto-from-name" className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Description *</label>
            <textarea name="description" required rows={3} className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" />
          </div>
          <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all disabled:opacity-50">
            {loading ? "Creating..." : "Create Career"}
          </button>
        </form>
      )}

      {/* Career list */}
      <div className="space-y-3">
        {filtered.map((career) => (
          <div key={career.id} className="flex items-center gap-4 bg-surface-raised rounded-2xl p-4 border border-[var(--border-color)] shadow-sm hover:shadow-card transition-all">
            <div className="flex-1 min-w-0">
              <Link href={`/admin/careers/${career.id}`} className="font-bold text-text-primary hover:text-accent transition-colors">
                {career.name}
              </Link>
              <p className="text-xs text-text-muted mt-0.5">{career.slug} · {career.pathCount} paths</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/careers/${career.id}`} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">
                Edit
              </Link>
              <button onClick={() => handleDelete(career.id, career.name)} className="text-xs px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <p className="text-center text-text-muted py-8 text-sm">No careers found.</p>}
    </div>
  );
}
