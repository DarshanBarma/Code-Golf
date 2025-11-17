"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface UserStatsProps {
  onStatsLoaded?: (stats: any) => void;
}

export function useUserStats() {
  const { user } = useUser();
  const stats = useQuery(
    api.users.getUserStats,
    user?.id ? { clerkId: user.id } : "skip"
  );

  return stats;
}
