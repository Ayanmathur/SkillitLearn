"use client";

import { useState, useTransition } from "react";
import { markStepComplete } from "./quiz/actions";
import { useRouter } from "next/navigation";

interface Step {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
}

interface Track {
  id: string;
  title: string;
  orderIndex: number;
  steps: Step[];
}

interface Props {
  tracks: Track[];
  completedStepIds: string[];
  isLoggedIn: boolean;
  skillId: string;
}

/**
 * Skill booklet content - renders tracks and steps.
 *
 * Track 1 is always unlocked (free preview).
 * Tracks 2+ are VISIBLE but NOT expandable without sign-in.
 * Locked tracks show a themed green lock icon that redirects to login.
 */
export function SkillBookletContent({
  tracks,
  completedStepIds: initialCompleted,
  isLoggedIn,
  skillId,
}: Props) {
  const router = useRouter();
  // Sort tracks by orderIndex to guarantee correct ordering
  const sortedTracks = [...tracks].sort((a, b) => a.orderIndex - b.orderIndex);

  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(
    () => new Set(sortedTracks.length > 0 ? [sortedTracks[0].id] : [])
  );
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(initialCompleted)
  );
  const [isPending, startTransition] = useTransition();

  function toggleTrack(id: string) {
    setExpandedTracks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleMarkComplete(stepId: string) {
    setCompletedIds((prev) => new Set([...Array.from(prev), stepId]));

    startTransition(async () => {
      try {
        const result = await markStepComplete(stepId);
        if (result?.success) {
          router.refresh();
        } else {
          setCompletedIds((prev) => {
            const next = new Set(prev);
            next.delete(stepId);
            return next;
          });
        }
      } catch {
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.delete(stepId);
          return next;
        });
      }
    });
  }

  let globalStepIndex = 0;

  function moduleProgress(mod: Track) {
    const completed = mod.steps.filter((s) => completedIds.has(s.id)).length;
    return { completed, total: mod.steps.length };
  }

  return (
    <div className="space-y-4">
      {sortedTracks.map((mod, mi) => {
        const isExpanded = expandedTracks.has(mod.id);
        const { completed, total } = moduleProgress(mod);
        const moduleDone = completed === total && total > 0;

        // Track 1 (index 0) is always unlocked. Tracks 2+ require sign-in.
        const isLocked = mi > 0 && !isLoggedIn;

        return (
          <div
            key={mod.id}
            className={`rounded-2xl border overflow-hidden shadow-sm transition-all ${
              moduleDone
                ? "border-green-200 dark:border-green-800 bg-surface-raised"
                : "border-[var(--border-color)] bg-surface-raised"
            }`}
          >
            {/* Track header */}
            <button
              onClick={() => {
                if (isLocked) {
                  router.push("/login");
                } else {
                  toggleTrack(mod.id);
                }
              }}
              className="w-full flex items-center gap-3 md:gap-4 p-3.5 sm:p-5 md:p-6 text-left
                         hover:bg-accent/5 transition-colors cursor-pointer"
            >
              {/* Track number */}
              <div
                className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs sm:text-sm font-bold ${
                  moduleDone
                    ? "bg-green-500 dark:bg-green-600 text-white"
                    : "bg-gray-800 dark:bg-gray-700 text-white"
                }`}
              >
                {moduleDone ? "✓" : mi + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary text-sm sm:text-base md:text-lg leading-snug">
                  {mod.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-text-muted">
                    {mod.steps.length} step{mod.steps.length !== 1 ? "s" : ""}
                  </span>
                  {isLocked && (
                    <>
                      <span className="text-xs text-text-muted">·</span>
                      <span className="text-xs font-medium text-accent">
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

              {/* Progress ring (unlocked + logged in) */}
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

              {/* Green Lock Icon (locked) or Chevron (unlocked) */}
              {isLocked ? (
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
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
                        isDone ? "bg-green-50 dark:bg-green-900/5" : ""
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

                      {/* Step content */}
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
