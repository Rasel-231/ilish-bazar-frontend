import { EmptyState } from "@/components/feedback/empty-state";
import { getInitials } from "@/lib/utils";

import type { IUser } from "../types/user.types";
import { getUserDisplayName } from "../utils/user.utils";

export function UserTable({ users }: { users: IUser[] }) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No users found"
        description="There are no users matching the current filters."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-foreground/[0.03] text-foreground/60">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-foreground/10">
              <td className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-medium">
                  {getInitials(user.name)}
                </span>
                <span className="flex flex-col">
                  <span className="font-medium">{getUserDisplayName(user)}</span>
                  <span className="text-xs text-foreground/60">{user.email}</span>
                </span>
              </td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">
                {user.isActive ? "Active" : "Inactive"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
