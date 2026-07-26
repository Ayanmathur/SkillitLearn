"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, updatePassword, deleteAccount } from "./actions";

interface Props {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}

export function SettingsForm({ user }: Props) {
  const router = useRouter();

  // Name state
  const [fullName, setFullName] = useState(user.fullName);
  const [nameMsg, setNameMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSavingName, setIsSavingName] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [passMsg, setPassMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isSavingPass, setIsSavingPass] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingName(true);
    setNameMsg(null);

    const res = await updateProfile(fullName);
    setIsSavingName(false);

    if (res.error) {
      setNameMsg({ text: res.error, isError: true });
    } else {
      setNameMsg({ text: res.message || "Updated!" });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPass(true);
    setPassMsg(null);

    const res = await updatePassword(newPassword);
    setIsSavingPass(false);

    if (res.error) {
      setPassMsg({ text: res.error, isError: true });
    } else {
      setPassMsg({ text: res.message || "Password updated successfully!" });
      setNewPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* ── 1. Profile / Name Section ─────────────────────────── */}
      <section className="bg-surface border border-border-color rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary mb-1">Personal Details</h2>
        <p className="text-xs text-text-muted mb-6">
          This name appears on your official verified certificates.
        </p>

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              Email Address
            </label>
            <input
              type="text"
              disabled
              value={user.email}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-raised border border-border-color
                         text-text-muted cursor-not-allowed text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              Full Name (Certificate Name)
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-color
                         text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {nameMsg && (
            <div className={`text-xs p-3 rounded-lg ${nameMsg.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {nameMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSavingName}
            className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full
                       px-6 py-2.5 text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {isSavingName ? "Saving..." : "Save Name"}
          </button>
        </form>
      </section>

      {/* ── 2. Password Security Section ─────────────────────── */}
      <section className="bg-surface border border-border-color rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary mb-1">Security & Password</h2>
        <p className="text-xs text-text-muted mb-6">
          Update your account password.
        </p>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 characters)"
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-color
                         text-text-primary focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {passMsg && (
            <div className={`text-xs p-3 rounded-lg ${passMsg.isError ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
              {passMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSavingPass}
            className="bg-accent hover:bg-accent-hover text-white font-semibold rounded-full
                       px-6 py-2.5 text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {isSavingPass ? "Updating..." : "Update Password"}
          </button>
        </form>
      </section>

      {/* ── 3. Danger Zone / Delete Account ──────────────────── */}
      <section className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-1">Danger Zone</h2>
        <p className="text-xs text-red-700/80 dark:text-red-300/80 mb-6">
          Permanently delete your SkillItLearn account and associated data.
        </p>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full
                     px-6 py-2.5 text-sm transition-all shadow-sm"
        >
          Delete Account
        </button>
      </section>

      {/* ── Delete Confirmation Modal ─────────────────────────── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border-color rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-text-primary">Delete Account Confirmation</h3>
            <p className="text-sm text-text-secondary">
              Are you sure you want to delete your account? This action cannot be undone and your learning progress will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 text-sm font-medium text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full px-5 py-2 text-sm disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
