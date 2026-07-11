"use client";

import { useState, useEffect, useCallback } from "react";
import { getQuizQuestions, submitQuiz } from "./actions";

interface Question {
  id: string;
  questionText: string;
  choices: Array<{ id: string; text: string }>;
}

interface Result {
  questionId: string;
  questionText: string;
  choices: Array<{ id: string; text: string }>;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface Props {
  skillId: string;
  skillName: string;
  backUrl: string;
  pathUrl: string;
}

type Phase = "loading" | "steps_incomplete" | "quiz" | "submitting" | "results";

export function QuizClient({ skillId, skillName, backUrl, pathUrl }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Result[] | null>(null);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stepsInfo, setStepsInfo] = useState({ completed: 0, total: 0 });

  const loadQuestions = useCallback(async () => {
    setPhase("loading");
    setAnswers({});
    setResults(null);
    setError(null);

    try {
      const data = await getQuizQuestions(skillId);

      if ("error" in data) {
        if (data.error === "complete_steps_first") {
          setStepsInfo({
            completed: (data as any).completed || 0,
            total: (data as any).total || 0,
          });
          setPhase("steps_incomplete");
        } else if (data.error === "not_enough_questions") {
          setError("This skill doesn't have enough quiz questions yet. Check back later.");
          setPhase("quiz");
        } else {
          setError(data.error as string);
          setPhase("quiz");
        }
        return;
      }

      if (data.questions) {
        setQuestions(data.questions);
        setPhase("quiz");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load quiz questions.");
      setPhase("quiz");
    }
  }, [skillId]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function selectAnswer(questionId: string, choiceId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  }

  async function handleSubmit() {
    if (Object.keys(answers).length < 5) {
      setError("Please answer all 5 questions before submitting.");
      return;
    }

    setPhase("submitting");
    setError(null);

    try {
      const result = await submitQuiz({ skillId, answers });

      if ("error" in result && result.error) {
        setError(result.error as string);
        setPhase("quiz");
        return;
      }

      setScore(result.score!);
      setPassed(result.passed!);
      setResults(result.results!);
      setPhase("results");
    } catch (err: any) {
      setError(err.message || "Failed to submit quiz.");
      setPhase("quiz");
    }
  }

  // ── Steps Incomplete ─────────────────────────────────
  if (phase === "steps_incomplete") {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Complete the steps first
        </h2>
        <p className="text-text-secondary mb-2">
          You&apos;ve completed {stepsInfo.completed} of {stepsInfo.total} steps
          in &ldquo;{skillName}&rdquo;.
        </p>
        <p className="text-text-secondary mb-6">
          Finish all steps before taking the quiz.
        </p>
        <div className="max-w-xs mx-auto mb-6">
          <div className="h-3 rounded-full bg-accent/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{
                width: `${stepsInfo.total > 0 ? (stepsInfo.completed / stepsInfo.total) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
        <a
          href={backUrl}
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                     font-semibold rounded-full px-8 py-3 transition-all"
        >
          Go to Skill Content
        </a>
      </div>
    );
  }

  // ── Loading ──────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary">Loading quiz questions...</p>
      </div>
    );
  }

  // ── Results ──────────────────────────────────────────
  if (phase === "results" && results) {
    return (
      <div>
        {/* Score card */}
        <div
          className={`text-center rounded-2xl p-8 mb-8 border-2 ${
            passed
              ? "bg-green-50 dark:bg-[#1a1a2e] dark:bg-green-900/10 border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
          }`}
        >
          <div className="text-5xl mb-3">{passed ? "🎉" : "😔"}</div>
          <h2 className="text-2xl font-bold text-text-primary mb-1">
            {passed ? "Congratulations! You passed!" : "Not quite - try again!"}
          </h2>
          <p className="text-lg text-text-secondary mb-1">
            Score: <span className="font-bold text-text-primary">{score}/5</span>{" "}
            ({Math.round((score / 5) * 100)}%)
          </p>
          <p className="text-sm text-text-muted">
            {passed
              ? "This skill is now marked as complete. Your quiz_passed status has been updated."
              : "You need 4/5 (80%) to pass. Review the explanations below and try again."}
          </p>
        </div>

        {/* Question results */}
        <div className="space-y-6 mb-8">
          {results.map((r, i) => (
            <div
              key={r.questionId}
              className={`rounded-2xl border p-5 ${
                r.isCorrect
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-[#1a1a2e]/50 dark:bg-green-900/5"
                  : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/5"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    r.isCorrect ? "bg-green-50 dark:bg-[#1a1a2e]0" : "bg-red-500"
                  }`}
                >
                  {r.isCorrect ? "✓" : "✗"}
                </span>
                <h3 className="font-semibold text-text-primary text-sm">
                  Q{i + 1}: {r.questionText}
                </h3>
              </div>

              <div className="space-y-2 ml-10 mb-3">
                {r.choices.map((c) => {
                  const isUserPick = c.id === r.userAnswer;
                  const isCorrect = c.id === r.correctAnswer;
                  let classes = "rounded-xl px-4 py-2.5 text-sm border transition-all ";

                  if (isCorrect) {
                    classes +=
                      "border-green-300 dark:border-green-700 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 font-medium";
                  } else if (isUserPick && !isCorrect) {
                    classes +=
                      "border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 line-through";
                  } else {
                    classes +=
                      "border-[var(--border-color)] bg-surface text-text-secondary";
                  }

                  return (
                    <div key={c.id} className={classes}>
                      <span className="font-mono text-xs mr-2 opacity-50">
                        {c.id.toUpperCase()}.
                      </span>
                      {c.text}
                      {isCorrect && " ✓"}
                      {isUserPick && !isCorrect && " (your answer)"}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div className="ml-10 rounded-xl bg-accent/5 border border-accent/10 px-4 py-3">
                <p className="text-xs font-semibold text-accent mb-1">
                  Explanation
                </p>
                <p className="text-sm text-text-secondary">{r.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {passed ? (
            <a
              href={pathUrl}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                         font-semibold rounded-full px-8 py-3 transition-all"
            >
              Back to Path
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          ) : (
            <button
              onClick={loadQuestions}
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white
                         font-semibold rounded-full px-8 py-3 transition-all"
            >
              Try Again (New Questions)
            </button>
          )}
          <a
            href={backUrl}
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            ← Back to skill content
          </a>
        </div>
      </div>
    );
  }

  // ── Quiz Form ────────────────────────────────────────
  const allAnswered = Object.keys(answers).length === questions.length;

  return (
    <div>
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 mb-6">
          {error}
        </div>
      )}

      {questions.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-text-secondary">No quiz questions available yet.</p>
          <a href={backUrl} className="text-accent text-sm mt-2 inline-block">
            ← Back to skill
          </a>
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, i) => (
          <div
            key={q.id}
            className="rounded-2xl border border-[var(--border-color)] bg-surface-raised p-5 md:p-6
                       shadow-sm transition-all"
          >
            <div className="flex items-start gap-3 mb-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-50 dark:bg-[#1a1a2e] text-white flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="font-semibold text-text-primary text-sm md:text-base leading-relaxed">
                {q.questionText}
              </h3>
            </div>

            <div className="space-y-2 ml-11">
              {q.choices.map((c) => {
                const isSelected = answers[q.id] === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectAnswer(q.id, c.id)}
                    className={`w-full text-left rounded-xl px-4 py-3 text-sm border-2 transition-all duration-200
                      ${
                        isSelected
                          ? "border-accent bg-accent/10 text-text-primary font-medium"
                          : "border-[var(--border-color)] bg-surface text-text-secondary hover:border-accent/30 hover:bg-accent/5"
                      }`}
                  >
                    <span className="font-mono text-xs mr-2 opacity-50">
                      {c.id.toUpperCase()}.
                    </span>
                    {c.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {questions.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || phase === "submitting"}
            className={`inline-flex items-center gap-2 font-semibold rounded-full px-10 py-3.5
                        transition-all duration-300 text-base
                        ${
                          allAnswered
                            ? "bg-accent hover:bg-accent-hover text-white hover:shadow-lg hover:shadow-accent/30"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-white/60 dark:text-gray-400 cursor-not-allowed"
                        }`}
          >
            {phase === "submitting" ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Grading...
              </>
            ) : (
              `Submit Quiz (${Object.keys(answers).length}/5 answered)`
            )}
          </button>
          {!allAnswered && (
            <p className="text-xs text-text-muted mt-2">
              Answer all 5 questions to submit
            </p>
          )}
        </div>
      )}
    </div>
  );
}
