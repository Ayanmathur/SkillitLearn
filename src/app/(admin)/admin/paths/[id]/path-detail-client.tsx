"use client";

import { useState } from "react";
import { updatePath } from "../../actions/path-actions";
import { createSkill, deleteSkill } from "../../actions/skill-actions";
import { SortableList } from "@/components/admin/sortable-list";

interface Path { id: string; name: string; slug: string; description: string; careerId: string }
interface Skill { id: string; name: string; slug: string; description: string; estimatedHours: number; moduleCount: number }

export function PathDetailClient({ path, skills }: { path: Path; skills: Skill[] }) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(null); setSaveMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", path.id); fd.set("careerId", path.careerId);
    const result = await updatePath(fd);
    if (result?.error) setError(result.error); else setSaveMsg("Saved!");
    setLoading(false); setTimeout(() => setSaveMsg(null), 3000);
  }

  async function handleCreateSkill(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("pathId", path.id);
    if (!fd.get("slug")) fd.set("slug", (fd.get("name") as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    const result = await createSkill(fd);
    if (result?.error) setError(result.error); else { setShowForm(false); window.location.reload(); }
    setLoading(false);
  }

  async function handleDeleteSkill(id: string) {
    const s = skills.find((sk) => sk.id === id);
    if (!confirm(`Delete skill "${s?.name}"?`)) return;
    const result = await deleteSkill(id);
    if (result?.error) alert(result.error); else window.location.reload();
  }

  return (
    <div className="space-y-8">
      <div className="card">
        <h2 className="text-lg font-bold text-text-primary mb-4">Edit Path</h2>
        {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-4">{error}</div>}
        {saveMsg && <div className="text-sm text-green-600 bg-green-50 dark:bg-[#1a1a2e] dark:bg-green-900/20 rounded-lg px-3 py-2 mb-4">{saveMsg}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-text-secondary mb-1">Name</label><input name="name" defaultValue={path.name} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1">Slug</label><input name="slug" defaultValue={path.slug} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-text-secondary mb-1">Description</label><textarea name="description" defaultValue={path.description} required rows={3} className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" /></div>
          <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2 text-sm transition-all disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
        </form>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Skills ({skills.length})</h2>
          <button onClick={() => setShowForm(!showForm)} className="text-xs px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">{showForm ? "Cancel" : "+ New Skill"}</button>
        </div>
        {showForm && (
          <form onSubmit={handleCreateSkill} className="space-y-3 mb-4 p-4 rounded-xl bg-surface border border-[var(--border-color)]">
            <div className="grid sm:grid-cols-3 gap-3">
              <input name="name" placeholder="Skill name" required className="rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
              <input name="slug" placeholder="slug (auto)" className="rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
              <input name="estimatedHours" type="number" min={1} defaultValue={10} placeholder="Est. hours" required className="rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
            <textarea name="description" placeholder="Description" required rows={2} className="w-full rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" />
            <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-5 py-2 text-sm transition-all disabled:opacity-50">Create</button>
          </form>
        )}
        <SortableList table="skills" items={skills.map((s) => ({ id: s.id, label: s.name, sublabel: `${s.moduleCount} tracks · ~${s.estimatedHours}h` }))} editHref={(id) => `/admin/skills/${id}`} onDelete={handleDeleteSkill} />
      </div>
    </div>
  );
}
