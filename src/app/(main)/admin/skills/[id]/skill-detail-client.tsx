"use client";

import { useState } from "react";
import { updateSkill } from "../../actions/skill-actions";
import { createModule, deleteModule } from "../../actions/module-step-actions";
import { createQuestion, updateQuestion, deleteQuestion } from "../../actions/quiz-actions";
import { SortableList } from "@/components/admin/sortable-list";

interface Skill { id: string; name: string; slug: string; description: string; estimatedHours: number; pathId: string }
interface Module { id: string; title: string; stepCount: number }
interface Choice { id: string; text: string }
interface Question { id: string; questionText: string; choicesJson: Choice[]; correctChoiceId: string; explanation: string }

export function SkillDetailClient({ skill, modules, questions }: { skill: Skill; modules: Module[]; questions: Question[] }) {
  const [showModForm, setShowModForm] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [editingQ, setEditingQ] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(null); setSaveMsg(null);
    const fd = new FormData(e.currentTarget);
    fd.set("id", skill.id); fd.set("pathId", skill.pathId);
    const r = await updateSkill(fd);
    if (r?.error) setError(r.error); else setSaveMsg("Saved!");
    setLoading(false); setTimeout(() => setSaveMsg(null), 3000);
  }

  async function handleCreateModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget); fd.set("skillId", skill.id);
    const r = await createModule(fd);
    if (r?.error) setError(r.error); else { setShowModForm(false); window.location.reload(); }
    setLoading(false);
  }

  async function handleDeleteModule(id: string) {
    if (!confirm("Delete this module?")) return;
    const r = await deleteModule(id);
    if (r?.error) alert(r.error); else window.location.reload();
  }

  return (
    <div className="space-y-8">
      {/* Edit Skill */}
      <div className="card">
        <h2 className="text-lg font-bold text-text-primary mb-4">Edit Skill</h2>
        {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mb-4">{error}</div>}
        {saveMsg && <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg px-3 py-2 mb-4">{saveMsg}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div><label className="block text-xs font-semibold text-text-secondary mb-1">Name</label><input name="name" defaultValue={skill.name} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1">Slug</label><input name="slug" defaultValue={skill.slug} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" /></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1">Est. Hours</label><input name="estimatedHours" type="number" defaultValue={skill.estimatedHours} required className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-text-secondary mb-1">Description</label><textarea name="description" defaultValue={skill.description} required rows={3} className="w-full rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" /></div>
          <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-2 text-sm transition-all disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
        </form>
      </div>

      {/* Modules */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Modules ({modules.length})</h2>
          <button onClick={() => setShowModForm(!showModForm)} className="text-xs px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">{showModForm ? "Cancel" : "+ New Module"}</button>
        </div>
        {showModForm && (
          <form onSubmit={handleCreateModule} className="flex gap-3 mb-4">
            <input name="title" placeholder="Module title" required className="flex-1 rounded-xl px-3 py-2 text-sm bg-surface border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
            <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-5 py-2 text-sm transition-all disabled:opacity-50">Create</button>
          </form>
        )}
        <SortableList table="modules" items={modules.map((m) => ({ id: m.id, label: m.title, sublabel: `${m.stepCount} steps` }))} editHref={(id) => `/admin/modules/${id}`} onDelete={handleDeleteModule} />
      </div>

      {/* Quiz Questions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-primary">Quiz Questions ({questions.length})</h2>
          <button onClick={() => { setShowQForm(!showQForm); setEditingQ(null); }} className="text-xs px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">{showQForm ? "Cancel" : "+ New Question"}</button>
        </div>

        {(showQForm || editingQ) && (
          <QuestionEditor
            skillId={skill.id}
            question={editingQ}
            onDone={() => { setShowQForm(false); setEditingQ(null); window.location.reload(); }}
            onCancel={() => { setShowQForm(false); setEditingQ(null); }}
          />
        )}

        <div className="space-y-2">
          {questions.map((q, i) => (
            <div key={q.id} className="flex items-start gap-3 bg-surface-raised rounded-xl p-3 border border-[var(--border-color)]">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1a1a2e] text-white text-xs flex items-center justify-center font-bold mt-0.5">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{q.questionText}</p>
                <p className="text-xs text-text-muted">Correct: {q.correctChoiceId.toUpperCase()}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => { setEditingQ(q); setShowQForm(false); }} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-semibold hover:bg-accent/20 transition-colors">Edit</button>
                <button onClick={async () => { if (confirm("Delete?")) { await deleteQuestion(q.id); window.location.reload(); } }} className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors">×</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Quiz Question Editor ────────────────────────────────────
function QuestionEditor({ skillId, question, onDone, onCancel }: {
  skillId: string; question: Question | null; onDone: () => void; onCancel: () => void;
}) {
  const [qText, setQText] = useState(question?.questionText ?? "");
  const [choices, setChoices] = useState<Choice[]>(
    question?.choicesJson ?? [{ id: "a", text: "" }, { id: "b", text: "" }, { id: "c", text: "" }, { id: "d", text: "" }]
  );
  const [correct, setCorrect] = useState(question?.correctChoiceId ?? "a");
  const [explanation, setExplanation] = useState(question?.explanation ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(null);
    const data = { skillId, questionText: qText, choicesJson: choices, correctChoiceId: correct, explanation, ...(question ? { id: question.id } : {}) };
    const fd = new FormData(); fd.set("data", JSON.stringify(data));
    const r = question ? await updateQuestion(fd) : await createQuestion(fd);
    if (r?.error) { setError(r.error); setLoading(false); return; }
    setLoading(false); onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6 p-4 rounded-xl bg-surface border border-[var(--border-color)]">
      <h3 className="font-bold text-sm text-text-primary">{question ? "Edit Question" : "New Question"}</h3>
      {error && <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">{error}</div>}

      <div>
        <label className="block text-xs font-semibold text-text-secondary mb-1">Question Text *</label>
        <textarea value={qText} onChange={(e) => setQText(e.target.value)} required rows={2} className="w-full rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" />
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-text-secondary">4 Choices (select correct one) *</label>
        {choices.map((c, i) => (
          <div key={c.id} className="flex items-center gap-2">
            <input type="radio" name="correct" value={c.id} checked={correct === c.id} onChange={() => setCorrect(c.id)}
              className="accent-accent flex-shrink-0" />
            <span className="text-xs font-mono text-text-muted w-5">{c.id.toUpperCase()}.</span>
            <input value={c.text} onChange={(e) => { const u = [...choices]; u[i] = { ...u[i], text: e.target.value }; setChoices(u); }} required placeholder={`Choice ${c.id.toUpperCase()}`}
              className="flex-1 rounded-lg px-3 py-1.5 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none" />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold text-text-secondary mb-1">Explanation (shown after answering) *</label>
        <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} required rows={2} className="w-full rounded-xl px-3 py-2 text-sm bg-surface-raised border border-[var(--border-color)] text-text-primary focus:ring-2 focus:ring-accent/50 focus:outline-none resize-y" />
      </div>

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-5 py-2 text-sm transition-all disabled:opacity-50">{loading ? "Saving..." : question ? "Update" : "Create"}</button>
        <button type="button" onClick={onCancel} className="text-sm text-text-muted hover:text-text-secondary transition-colors">Cancel</button>
      </div>
    </form>
  );
}
