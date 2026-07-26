import { getCurrentUser } from "@/app/auth/actions";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export const metadata = {
  title: "Account Settings - SkillItLearn",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container-page py-12 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Account Settings</h1>
        <p className="text-text-secondary text-sm">
          Manage your personal information, update your password, or manage your account.
        </p>
      </div>

      <SettingsForm user={user} />
    </div>
  );
}
