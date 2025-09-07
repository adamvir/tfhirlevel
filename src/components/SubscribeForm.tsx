import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/mailchimp-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Hiba történt!");

      setMessage("✅ Köszönjük! Nézd meg az emailed és erősítsd meg a feliratkozást.");
      setEmail("");
      setFirstName("");
    } catch (err: any) {
      setMessage("❌ " + (err.message || "Sikertelen feliratkozás."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm">
      <input
        type="text"
        placeholder="Keresztnév (opcionális)"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="email"
        placeholder="Email címed"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white rounded px-4 py-2"
      >
        {loading ? "Küldés..." : "Feliratkozom"}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
