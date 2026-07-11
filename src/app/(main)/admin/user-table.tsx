"use client";

import { useState } from "react";
import { updateUserRole } from "./actions";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: Date;
}

const ROLE_BADGES: Record<string, { bg: string; text: string }> = {
  learner: { bg: "bg-accent/10", text: "text-accent" },
  instructor: { bg: "bg-blue-500/10", text: "text-blue-500" },
  admin: { bg: "bg-orange-500/10", text: "text-orange-500" },
  super_admin: { bg: "bg-red-500/10", text: "text-red-500" },
};

export function AdminUserTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [search, setSearch] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  async function handleRoleChange(userId: string, newRole: string) {
    setStatusMap((prev) => ({ ...prev, [userId]: "saving..." }));
    const fd = new FormData();
    fd.set("userId", userId);
    fd.set("role", newRole);
    const result = await updateUserRole(fd);
    if (result?.error) {
      setStatusMap((prev) => ({ ...prev, [userId]: result.error! }));
    } else {
      setStatusMap((prev) => ({ ...prev, [userId]: "✅ Updated" }));
      // Clear status after 2s
      setTimeout(() => {
        setStatusMap((prev) => {
          const next = { ...prev };
          delete next[userId];
          return next;
        });
      }, 2000);
    }
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-[var(--border-color)]">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-4 py-2.5 text-sm
                     bg-surface border border-[var(--border-color)]
                     text-text-primary placeholder-text-muted
                     focus:outline-none focus:ring-2 focus:ring-accent/50
                     transition-all duration-200"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-color)] bg-surface-raised">
              <th className="text-left px-4 py-3 font-semibold text-text-secondary">
                User
              </th>
              <th className="text-left px-4 py-3 font-semibold text-text-secondary">
                Email
              </th>
              <th className="text-left px-4 py-3 font-semibold text-text-secondary">
                Role
              </th>
              <th className="text-left px-4 py-3 font-semibold text-text-secondary">
                Joined
              </th>
              <th className="text-left px-4 py-3 font-semibold text-text-secondary">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => {
              const badge = ROLE_BADGES[user.role] || ROLE_BADGES.learner;
              const isCurrentUser = user.id === currentUserId;
              return (
                <tr
                  key={user.id}
                  className="border-b border-[var(--border-color)] hover:bg-surface-raised transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {user.fullName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-text-muted">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badge.bg} ${badge.text}`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {isCurrentUser ? (
                      <span className="text-xs text-text-muted">-</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          defaultValue={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          className="rounded-lg px-2 py-1.5 text-xs bg-surface border border-[var(--border-color)]
                                     text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
                        >
                          <option value="learner">Learner</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                        {statusMap[user.id] && (
                          <span className="text-xs text-text-muted">
                            {statusMap[user.id]}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-text-muted text-sm">
          No users found matching &ldquo;{search}&rdquo;
        </div>
      )}
    </div>
  );
}
