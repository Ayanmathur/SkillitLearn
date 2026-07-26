"use client";

import { useState, useTransition } from "react";
import { markStepComplete } from "./quiz/actions";
import Link from "next/link";

interface Step {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
}

interface Module {
  id: string;
  title: string;
  orderIndex: number;
  steps: Step[];
}

interface Props {
  modules: Module[];
  completedStepIds: string[];
  isLoggedIn: boolean;
  skillId: string;
}

/**
 * Skill booklet content - renders modules and steps in a
 * step-wise, booklet/manual format with collapsible sections.
 *
 * Module 1 is always unlocked (free preview).
 * Modules 2+ require sign-in to access.
 */
export function SkillBookletContent({
  modules,
  completedStepIds: initialCompleted,
  isLoggedIn,
  skillId,
}: Props) {
  // Sort modules by orderIndex to guarantee correct ordering
  const sortedModules = [...modules].sort((a, b) => a.orderIndex - b.orderIndex);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    () => new Set(sortedModules.length > 0 ? [sortedModules[0].id] : [])
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(initialCompleted)
  );
  const [isPending, startTransition] = useTransition();

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleMarkComplete(stepId: string) {
    // 0ms Optimistic Instant Update
    setCompletedIds((prev) => new Set([...Array.from(prev), stepId]));

    startTransition(async () => {
      const result = await markStepComplete(stepId);
      if (!result.success) {
        // Revert on error
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(stepId);
          return next;
        });
      }
    });
  }

  let globalStepIndex = 0;

  // Calculate per-module progress
  function moduleProgress(mod: Module) {
    const completed = mod.steps.filter((s) => completedIds.has(s.id)).length;
    return { completed, total: mod.steps.length };
  }

  return (
    <div className="space-y-4">
      {sortedModules.map((mod, mi) => {
        const isExpanded = expandedModules.has(mod.id);
        const { completed, total } = moduleProgress(mod);
        const moduleDone = completed === total && total > 0;

        // Module 1 (index 0) is always unlocked. Modules 2+ require sign-in.
        const isLocked = mi > 0 && !isLoggedIn;

        return (
          <div
            key={mod.id}
            className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
              isLocked
                ? "border-[var(--border-color)] bg-surface-raised opacity-75"
                : moduleDone
                ? "border-green-200 dark:border-green-800 bg-surface-raised"
                : "border-[var(--border-color)] bg-surface-raised"
            }`}
          >
            {/* Module header (collapsible) */}
            <button
              onClick={() => !isLocked && toggleModule(mod.id)}
              className={`w-full flex items-center gap-4 p-5 md:p-6 text-left transition-colors ${
                isLocked ? "cursor-not-allowed" : "hover:bg-accent/5"
              }`}
              disabled={isLocked}
            >
              {/* Module number */}
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                  isLocked
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                    : moduleDone
                    ? "bg-green-500 dark:bg-green-600 text-white"
                    : "bg-gray-800 dark:bg-gray-700 text-white"
                }`}
              >
                {isLocked ? "🔒" : moduleDone ? "✓" : mi + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary text-base md:text-lg">
                  {mod.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">
                    {mod.steps.length} step{mod.steps.length !== 1 ? "s" : ""}
                  </span>
                  {isLocked && (
                    <>
                      <span className="text-xs text-text-muted">·</span>
                      <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        Sign in to unlock
                      </span>
                    </>
                  )}
                  {!isLocked && isLoggedIn && total > 0 && (
                    <>
                      <span className="text-xs text-text-muted">·</span>
                      <span
                        className={`text-xs font-medium ${
                          moduleDone ? "text-green-600 dark:text-green-400" : "text-text-muted"
                        }`}
                      >
                        {completed}/{total} done
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Progress ring */}
              {!isLocked && isLoggedIn && total > 0 && (
                <div className="flex-shrink-0 w-8 h-8 relative mr-2">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle
                      cx="18" cy="18" r="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="text-accent/10"
                    />
                    <circle
                      cx="18" cy="18" r="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray={`${(completed / total) * 94.2} 94.2`}
                      strokeLinecap="round"
                      className={moduleDone ? "text-green-500" : "text-accent"}
                    />
                  </svg>
                </div>
              )}

              {/* Chevron or Lock */}
              {isLocked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-text-muted">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 text-text-muted transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </button>

            {/* Locked overlay for modules 2+ when not signed in */}
            {isLocked && (
              <div className="border-t border-[var(--border-color)] bg-surface/50 px-5 md:px-6 py-4 text-center">
                <p className="text-sm text-text-secondary mb-3">
                  Sign in to unlock this module and track your progress.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                             font-semibold rounded-full px-6 py-2 text-sm transition-all"
                >
                  Sign in to continue
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            )}

            {/* Steps (only shown if expanded and not locked) */}
            {isExpanded && !isLocked && (
              <div className="border-t border-[var(--border-color)]">
                {mod.steps
                  .sort((a, b) => a.orderIndex - b.orderIndex)
                  .map((step) => {
                  globalStepIndex++;
                  const isDone = completedIds.has(step.id);
                  return (
                    <div
                      key={step.id}
                      className={`border-b border-[var(--border-color)] last:border-b-0 ${
                        isDone ? "bg-green-50 dark:bg-[#1a1a2e]/50 dark:bg-green-900/5" : ""
                      }`}
                    >
                      {/* Step header */}
                      <div className="flex items-start gap-3 md:gap-4 px-5 md:px-6 pt-5 md:pt-6 pb-3">
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${
                            isDone
                              ? "bg-green-500 dark:bg-green-600 text-white"
                              : "bg-accent/10 text-accent"
                          }`}
                        >
                          {isDone ? "✓" : globalStepIndex}
                        </span>
                        <h4 className="font-semibold text-text-primary text-sm md:text-base flex-1">
                          {step.title}
                        </h4>

                        {/* Mark complete button */}
                        {isLoggedIn && !isDone && (
                          <button
                            onClick={() => handleMarkComplete(step.id)}
                            disabled={isPending}
                            className="flex-shrink-0 text-[10px] px-3 py-1 rounded-full
                                       border border-accent/30 text-accent
                                       hover:bg-accent hover:text-white
                                       transition-all font-semibold disabled:opacity-50"
                          >
                            Mark done
                          </button>
                        )}
                        {isLoggedIn && isDone && (
                          <span className="flex-shrink-0 text-[10px] px-3 py-1 rounded-full
                                           bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 font-semibold">
                            Done ✓
                          </span>
                        )}
                      </div>

                      {/* Step content (rendered as formatted text) */}
                      {step.content && (
                        <div className="px-5 md:px-6 pb-5 md:pb-6 pl-[3.25rem] md:pl-[3.75rem]">
                          <div className="prose prose-sm max-w-none
                                          text-text-secondary leading-relaxed
                                          prose-headings:text-text-primary
                                          prose-headings:font-bold
                                          prose-h3:text-base prose-h4:text-sm
                                          prose-strong:text-text-primary
                                          prose-code:bg-accent/10 prose-code:text-accent
                                          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                          prose-code:text-xs prose-code:font-mono
                                          prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl
                                          prose-pre:text-sm
                                          prose-ul:space-y-1 prose-ol:space-y-1
                                          prose-li:text-text-secondary
                                          prose-a:text-accent prose-a:no-underline
                                          hover:prose-a:underline">
                            <StepContent content={step.content} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders step content as formatted HTML.
 */
function StepContent({ content }: { content: string }) {
  const blocks = content.split(/\n\n+/);

  return (
    <>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const code = lines.slice(1, -1).join("\n");
          return (
            <pre key={i} className="bg-[#1e1e2e] text-green-300 rounded-xl p-4 text-xs overflow-x-auto my-3">
              <code>{code || lines.slice(1).join("\n")}</code>
            </pre>
          );
        }

        if (trimmed.startsWith("### ")) {
          return <h4 key={i} className="text-sm font-bold text-text-primary mt-4 mb-2">{trimmed.slice(4)}</h4>;
        }
        if (trimmed.startsWith("## ")) {
          return <h3 key={i} className="text-base font-bold text-text-primary mt-5 mb-2">{trimmed.slice(3)}</h3>;
        }

        if (trimmed.match(/^[-*•]\s/m)) {
          const items = trimmed.split(/\n/).filter((l) => l.trim());
          return (
            <ul key={i} className="list-disc list-inside space-y-1 my-2">
              {items.map((item, j) => (
                <li key={j} className="text-sm">
                  <InlineText text={item.replace(/^[-*•]\s*/, "")} />
                </li>
              ))}
            </ul>
          );
        }

        if (trimmed.match(/^\d+\.\s/m)) {
          const items = trimmed.split(/\n/).filter((l) => l.trim());
          return (
            <ol key={i} className="list-decimal list-inside space-y-1 my-2">
              {items.map((item, j) => (
                <li key={j} className="text-sm">
                  <InlineText text={item.replace(/^\d+\.\s*/, "")} />
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="text-sm my-2">
            <InlineText text={trimmed} />
          </p>
        );
      })}
    </>
  );
}

/** Renders inline markdown: **bold**, *italic*, `code` */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={i} className="bg-accent/10 text-accent px-1.5 py-0.5 rounded text-xs font-mono">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
