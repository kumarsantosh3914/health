"use client";

import { useState } from "react";

export default function NewsletterSection({ city }: { city?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage("Please enter a valid email.");
      return;
    }
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, city }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setMessage(data.error ?? "Subscription failed.");
      } else {
        setState("done");
        setMessage(data.message ?? "You're subscribed! 🎉");
      }
    } catch {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 px-6 py-10 text-center sm:px-12">
        <div className="mb-2 text-3xl">💓</div>
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white sm:text-3xl">
          The Health Pulse
        </h2>
        <p className="mx-auto mt-2 max-w-md text-gray-600 dark:text-gray-300">
          New doctors, free health camps, and one health tip — every week. Free.
        </p>

        {state === "done" ? (
          <p className="mt-6 font-semibold text-accent">{message}</p>
        ) : (
          <form
            onSubmit={submit}
            className="mx-auto mt-6 flex w-full max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600 disabled:opacity-60"
            >
              {state === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}
        {state === "error" && (
          <p className="mt-3 text-sm text-red-500">{message}</p>
        )}
      </div>
    </section>
  );
}
