import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    console.log("✅ Webhook hit!");

    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.log("❌ Missing CLERK_WEBHOOK_SECRET");
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      console.log("❌ Svix headers missing");
      return new Response("No svix headers found", {
        status: 400,
      });
    }

    const payload = await request.json();
    console.log("📦 Raw payload:", payload);

    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
      console.log("✅ Webhook verified!");
    } catch (err) {
      console.error("❌ Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;
    console.log("🔔 Webhook Event Type:", eventType);

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const email = email_addresses[0]?.email_address || "";
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      console.log("📥 Syncing user:", {
        clerkId: id,
        name,
        email,
        image: image_url,
      });

      try {
        const result = await ctx.runMutation(api.users.syncUser, {
          clerkId: id,
          email,
          name,
          image: image_url,
        });
        console.log("✅ Mutation result:", result);
      } catch (err) {
        console.error("❌ Failed to sync user:", err);
        return new Response("Error creating user", { status: 500 });
      }
    } else {
      console.log("ℹ️ Ignored event type:", eventType);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
