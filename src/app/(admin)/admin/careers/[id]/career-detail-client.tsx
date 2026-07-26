"use client";

import { useState } from "react";
import { updateCareer } from "../../actions/career-actions";
import { createPath, deletePath } from "../../actions/path-actions";
import { SortableList } from "@/components/admin/sortable-list";

interface Career { id: string; name: string; slug: string; description: string }
interface Path { id: string; name: string; slug: string; description: string; skillCount: number }

export function CareerDetailClient({ career, paths }: { career: Career; paths: Path[] }) {
  const [showPathForm, setShowPathForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpdateCareer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null); setSaveMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", career.id);
    const result = await updateCareer(fd);
    if (result?.error) setError(result.error);
    else setSaveMsg("Career updated!");
    setLoading(false);
    setTimeout(() => setSaveMsg(null), 3000);
  }

  async function handleCreatePath(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("careerId", career.id);
    if (!fd.get("slug")) {
      fd.set("slug", (fd.get("name") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
    const result = await createPath(fd);
    if (result?.error) setError(result.error);
    else { setShowPathForm(false); window.location.reload(); }
    setLoading(false);
  }

  async function handleDeletePath(id: string) {
    const path = paths.find((p) => p.id === id);
    if (!confirm(`Delete path "${path?.name}"?`)) return;
    const result = await deletePath(id);
    if (result?.error) alert(result.error);
    else window.location.reload();
  }

  return (
    <div className="space-y-8">
      {/* Edit Career */}
      <div className="card">
        <h2 className="text-lg font-bold text-text-primary mb-4">Edit Career</h2>
        {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-4">{error}</div>}
        {saveMsg && <div className="text-sm text-green-600 bg-green-50 dark:bg-[#1a1a2e] dark:bg-green-900/20 rounded-lg px-3 py-2 mb-4">{saveMsg}</div>}
        <form onSubmit={handleUpdateCareer} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Name</label>
              <input name="name" defaultValue={career.name} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Slug</label>
              <input name="slug" defaultValue={career.slug} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Description</label>
            <textarea name="description" defaultValue={career.description} required rows={3} className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" />
          </div>
          <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2 text-sm transition-all disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Paths */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Paths ({paths.length})</h2>
          <button onClick={() => setShowPathForm(!showPathForm)} className="text-xs px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">
            {showPathForm ? "Cancel" : "+ New Path"}
          </button>
        </div>

        {showPathForm && (
          <form onSubmit={handleCreatePath} className="space-y-3 mb-4 p-4 rounded-xl bg-surface border border-[var(--border-color)]">
            <div className="grid sm:grid-cols-2 gap-3">
              <input name="name" placeholder="Path name" required className="rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
              <input name="slug" placeholder="slug (auto)" className="rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
            <textarea name="description" placeholder="Description" required rows={2} className="w-full rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" />
            <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-5 py-2 text-sm transition-all disabled:opacity-50">
              Create Path
            </button>
          </form>
        )}

        <SortableList
          table="paths"
          items={paths.map((p) => ({ id: p.id, label: p.name, sublabel: `${p.skillCount} skills · ${p.slug}` }))}
          editHref={(id) => `/admin/paths/${id}`}
          onDelete={handleDeletePath}
        />
      </div>
    </div>
  );
}
