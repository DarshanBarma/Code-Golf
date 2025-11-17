"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export function UserSync() {
  const { user, isLoaded } = useUser();
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data with Convex
      createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
        username: user.username || undefined,
        imageUrl: user.imageUrl || undefined,
      });
    }
  }, [isLoaded, user, createUser]);

  return null;
}
