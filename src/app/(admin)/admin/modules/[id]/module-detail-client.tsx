"use client";

import { useState } from "react";
import { updateTrack, createStep, updateStep, deleteStep } from "../../actions/module-step-actions";
import { SortableList } from "@/components/admin/sortable-list";
import { MarkdownEditor } from "@/components/admin/markdown-editor";

interface Track { id: string; title: string; skillId: string }
interface Step { id: string; title: string; content: string }

export function TrackDetailClient({ track: mod, steps }: { track: Track; steps: Step[] }) {
  const [editingStep, setEditingStep] = useState<Step | null>(null);
  const [showStepForm, setShowStepForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New step state
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  // Edit step state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  async function handleUpdateTrack(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(null); setSaveMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", mod.id); fd.set("skillId", mod.skillId);
    const r = await updateTrack(fd);
    if (r?.error) setError(r.error); else setSaveMsg("Saved!");
    setLoading(false); setTimeout(() => setSaveMsg(null), 3000);
  }

  async function handleCreateStep(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    const fd = new FormData();
    fd.set("title", newTitle); fd.set("content", newContent); fd.set("moduleId", mod.id);
    const r = await createStep(fd);
    if (r?.error) setError(r.error); else { setShowStepForm(false); setNewTitle(""); setNewContent(""); window.location.reload(); }
    setLoading(false);
  }

  async function handleUpdateStep(e: React.FormEvent) {
    e.preventDefault(); if (!editingStep) return;
    setLoading(true); setError(null);
    const fd = new FormData();
    fd.set("id", editingStep.id); fd.set("title", editTitle); fd.set("content", editContent); fd.set("moduleId", mod.id);
    const r = await updateStep(fd);
    if (r?.error) setError(r.error); else { setEditingStep(null); window.location.reload(); }
    setLoading(false);
  }

  async function handleDeleteStep(id: string) {
    if (!confirm("Delete this step?")) return;
    const r = await deleteStep(id) as any;
    if (r?.error) alert(r.error); else window.location.reload();
  }

  function startEditing(id: string) {
    const step = steps.find((s) => s.id === id);
    if (!step) return;
    setEditingStep(step);
    setEditTitle(step.title);
    setEditContent(step.content);
    setShowStepForm(false);
  }

  return (
    <div className="space-y-8">
      {/* Edit Track */}
      <div className="card">
        <h2 className="text-lg font-bold text-text-primary mb-4">Edit Track</h2>
        {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-4">{error}</div>}
        {saveMsg && <div className="text-sm text-green-600 bg-green-50 dark:bg-[#1a1a2e] dark:bg-green-900/20 rounded-lg px-3 py-2 mb-4">{saveMsg}</div>}
        <form onSubmit={handleUpdateTrack} className="flex gap-3">
          <input name="title" defaultValue={mod.title} required className="flex-1 rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
          <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2 text-sm transition-all disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
        </form>
      </div>

      {/* Steps */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Steps ({steps.length})</h2>
          <button onClick={() => { setShowStepForm(!showStepForm); setEditingStep(null); }} className="text-xs px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">{showStepForm ? "Cancel" : "+ New Step"}</button>
        </div>

        {/* Create step form */}
        {showStepForm && (
          <form onSubmit={handleCreateStep} className="space-y-4 mb-6 p-4 rounded-xl bg-surface border border-[var(--border-color)]">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Step Title *</label>
              <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Content (Markdown) *</label>
              <MarkdownEditor value={newContent} onChange={setNewContent} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-5 py-2 text-sm transition-all disabled:opacity-50">Create Step</button>
              <button type="button" onClick={() => setShowStepForm(false)} className="text-sm text-text-muted hover:text-text-secondary">Cancel</button>
            </div>
          </form>
        )}

        {/* Edit step form */}
        {editingStep && (
          <form onSubmit={handleUpdateStep} className="space-y-4 mb-6 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <h3 className="text-sm font-bold text-accent">Editing: {editingStep.title}</h3>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Step Title *</label>
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">Content (Markdown)</label>
              <MarkdownEditor value={editContent} onChange={setEditContent} />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-5 py-2 text-sm transition-all disabled:opacity-50">Save Changes</button>
              <button type="button" onClick={() => setEditingStep(null)} className="text-sm text-text-muted hover:text-text-secondary">Cancel</button>
            </div>
          </form>
        )}

        {/* Step list with drag-and-drop */}
        <SortableList
          table="steps"
          items={steps.map((s) => ({ id: s.id, label: s.title, sublabel: `${s.content.length} chars` }))}
          onEdit={startEditing}
          onDelete={handleDeleteStep}
        />
      </div>
    </div>
  );
}
