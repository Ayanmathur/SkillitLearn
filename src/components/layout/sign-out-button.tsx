"use client";

import { signOut } from "@/app/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5"
      >
        Sign out
      </button>
    </form>
  );
}
