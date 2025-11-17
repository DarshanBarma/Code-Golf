import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook handler for Clerk user events
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const payload = await request.json();
    const { type, data } = payload;

    switch (type) {
      case "user.created":
      case "user.updated":
        await ctx.runMutation(api.users.createUser, {
          clerkId: data.id,
          email: data.email_addresses[0]?.email_address || "",
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || undefined,
          username: data.username || undefined,
          imageUrl: data.image_url || undefined,
        });
        break;
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
