import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileDashboard } from "@/components/account/ProfileDashboard";
// import { getSession } from "@/lib/auth"; // your real session helper

export const metadata: Metadata = {
  title: "Your Profile — Otaru",
  robots: { index: false },
};

export default async function ProfilePage() {
  // Authorization check belongs on the server, every request — never
  // infer "signed in" from client state alone (section 13).
  // const session = await getSession();
  // if (!session) redirect("/sign-in");

  // const member = await getMemberProfile(session.userId); // scoped to the
  // authenticated user's own id — never accept an id from the client here.

  return (
    <ProfileDashboard
      memberSince="MMXXV"
      tier="Archival"
      acquiredCount={7}
      savedCount={3}
    />
  );
}
