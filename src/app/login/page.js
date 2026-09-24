"use client";
import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import styles from "./login.module.css";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || "Unable to sign in.");
      return;
    }
    localStorage.setItem("adminToken", data.token);
    window.location.assign("/");
  }
  return (
    <main className={styles.page}>
      <form className={styles.card} onSubmit={submit}>
        <div className={styles.logo}>M</div>
        <h1>Admin sign in</h1>
        <p>Sign in to access your MILO dashboard.</p>
        <label>
          Email address
          <div>
            <Mail size={17} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@milo.com"
            />
          </div>
        </label>
        <label>
          Password
          <div>
            <LockKeyhole size={17} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
        </label>
        {error && <small>{error}</small>}
        <button disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
