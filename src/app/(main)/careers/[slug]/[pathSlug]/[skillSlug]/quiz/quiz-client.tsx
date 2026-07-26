"use client";

import { useState, useEffect, useCallback } from "react";
import { getQuizQuestionsBySlug, submitQuiz } from "./actions";

interface Question {
  id: string;
  questionText: string;
  choices: Array<{ id: string; text: string }>;
  difficulty?: string;
}

interface Result {
  questionId: string;
  questionText: string;
  choices: Array<{ id: string; text: string }>;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  difficulty?: string;
}

interface Props {
  skillSlug: string;
  skillName: string;
  backUrl: string;
  pathUrl: string;
}

type Phase = "loading" | "no_questions" | "quiz" | "submitting" | "results";

export function QuizClient({ skillSlug, skillName, backUrl, pathUrl }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [skillId, setSkillId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [results, setResults] = useState<Result[] | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(15);
  const [passed, setPassed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setPhase("loading");
    setAnswers({});
    setResults(null);
    setError(null);

    try {
      const data = await getQuizQuestionsBySlug(skillSlug);

      if ("error" in data) {
        setPhase("no_questions");
        return;
      }

      setSkillId(data.skillId);
      setQuestions(data.questions);
      setTotal(data.questions.length);
      setPhase("quiz");
    } catch (err: any) {
      setError(err.message || "Failed to load quiz.");
      setPhase("no_questions");
    }
  }, [skillSlug]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const handleSelectChoice = (questionId: string, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    setPhase("submitting");
    setError(null);

    try {
      const res = await submitQuiz({ skillId, answers });
      if (res.error) {
        setError(res.error);
        setPhase("quiz");
        return;
      }

      setScore(res.score ?? 0);
      setTotal(res.total || 15);
      setPassed(res.passed ?? false);
      setResults(res.results || []);
      setPhase("results");
    } catch (err: any) {
      setError(err.message || "Failed to grade quiz.");
      setPhase("quiz");
    }
  };

  if (phase === "loading") {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm font-medium">Preparing your 15-question quiz...</p>
      </div>
    );
  }

  if (phase === "no_questions") {
    return (
      <div className="bg-surface-raised rounded-2xl p-8 text-center border border-border-color">
        <div className="text-4xl mb-3">📝</div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Quiz Questions Coming Soon</h3>
        <p className="text-sm text-text-secondary mb-6">
          Quiz questions for &quot;{skillName}&quot; are currently being finalized.
        </p>
        <a
          href={backUrl}
          className="inline-flex items-center gap-2 bg-accent text-white font-semibold rounded-full px-6 py-2.5 text-sm"
        >
          Back to Skill Booklet Track
        </a>
      </div>
    );
  }

  if (phase === "results" && results) {
    const percent = Math.round((score / total) * 100);

    return (
      <div className="space-y-8 animate-fade-in">
        {/* Banner */}
        <div
          className={`rounded-3xl p-8 text-center border shadow-lg ${
            passed
              ? "bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800"
              : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
          }`}
        >
          <div className="text-5xl mb-3">{passed ? "🎉" : "💪"}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {passed ? "Congratulations! You Passed!" : "Keep Going! Practice Makes Perfect."}
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
            {passed
              ? `You answered ${score} out of ${total} questions correctly (${percent}%). Passing criteria is 10/15 (66%).`
              : `You scored ${score}/${total} (${percent}%). You need 10/15 (66%) to pass.`}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {!passed && (
              <button
                onClick={loadQuestions}
                className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-8 py-3 text-sm transition-all"
              >
                Try New Question Set
              </button>
            )}
            <a
              href={pathUrl}
              className="bg-surface border border-border-color hover:border-accent text-text-primary font-semibold rounded-full px-8 py-3 text-sm transition-all"
            >
              Back to Learning Path
            </a>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-text-primary">Question Review</h3>
          {results.map((r, i) => (
            <div
              key={r.questionId}
              className={`rounded-2xl p-6 border bg-surface-raised ${
                r.isCorrect ? "border-green-300 dark:border-green-800" : "border-red-300 dark:border-red-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="font-bold text-sm text-text-primary">
                  Question {i + 1} of {total}
                </span>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    r.isCorrect
                      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                      : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                  }`}
                >
                  {r.isCorrect ? "Correct ✓" : "Incorrect ✗"}
                </span>
              </div>

              <p className="text-base font-semibold text-text-primary mb-4">{r.questionText}</p>

              <div className="space-y-2 mb-4">
                {r.choices.map((c) => {
                  const isUserChoice = String(c.id) === String(r.userAnswer);
                  const isCorrectChoice = String(c.id) === String(r.correctAnswer);

                  let btnStyle = "border-border-color text-text-secondary";
                  if (isCorrectChoice) {
                    btnStyle = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-semibold";
                  } else if (isUserChoice && !r.isCorrect) {
                    btnStyle = "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
                  }

                  return (
                    <div key={c.id} className={`p-3 rounded-xl border text-sm flex items-center justify-between ${btnStyle}`}>
                      <span>{c.text}</span>
                      {isCorrectChoice && <span className="text-xs font-bold text-green-600">Correct Answer</span>}
                      {isUserChoice && !isCorrectChoice && <span className="text-xs font-bold text-red-500">Your Selection</span>}
                    </div>
                  );
                })}
              </div>

              {r.explanation && (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 text-xs text-text-secondary">
                  💡 <strong className="text-accent">Explanation:</strong> {r.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="bg-surface-raised border border-border-color rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">
            Competency Evaluation
          </div>
          <h2 className="text-lg font-bold text-text-primary">
            15 Randomized Questions (5 Easy, 5 Moderate, 5 Difficult)
          </h2>
          <p className="text-xs text-text-secondary mt-1">
            Passing criteria: Answer <strong>10 out of 15</strong> questions correctly (66%).
          </p>
        </div>

        <div className="bg-accent/10 text-accent font-bold px-4 py-2 rounded-full text-xs">
          {answeredCount} / {questions.length} Answered
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs font-medium">
          ⚠️ {error}
        </div>
      )}

      {/* Questions list */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => (
          <div
            key={q.id}
            className="bg-surface-raised border border-border-color rounded-2xl p-6 shadow-sm hover:border-accent/40 transition-all"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold text-accent">
                Question {qIdx + 1} of {questions.length}
              </span>
              {q.difficulty && (
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md bg-surface border border-border-color text-text-muted">
                  {q.difficulty}
                </span>
              )}
            </div>

            <h3 className="text-base font-bold text-text-primary mb-4 leading-snug">
              {q.questionText}
            </h3>

            <div className="space-y-2">
              {q.choices.map((c, cIdx) => {
                const selected = answers[q.id] === cIdx;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectChoice(q.id, cIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      selected
                        ? "border-accent bg-accent/10 text-text-primary shadow-sm"
                        : "border-border-color bg-surface hover:bg-surface-raised text-text-secondary"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                        selected
                          ? "border-accent bg-accent text-white"
                          : "border-border-color text-text-muted"
                      }`}
                    >
                      {String.fromCharCode(65 + cIdx)}
                    </div>
                    <span className="flex-1">{c.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button Bar */}
      <div className="sticky bottom-4 z-20 bg-surface-raised/90 backdrop-blur-md border border-border-color rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xl">
        <span className="text-xs text-text-secondary font-medium">
          {answeredCount === questions.length ? "✅ Ready to Submit" : `Answer remaining ${questions.length - answeredCount} questions`}
        </span>

        <button
          onClick={handleSubmit}
          disabled={phase === "submitting" || answeredCount < questions.length}
          className="bg-accent hover:bg-accent-hover text-white font-bold rounded-full px-8 py-3 text-sm transition-all disabled:opacity-50 shadow-md"
        >
          {phase === "submitting" ? "Grading Quiz..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
