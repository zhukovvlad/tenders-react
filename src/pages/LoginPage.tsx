import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav("/", { replace: true });
    } catch {
      setErr("Неверный логин или пароль");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
        {err && <div className="text-sm">{err}</div>}
        <button className="w-full border rounded px-3 py-2" type="submit">Login</button>
      </form>
    </div>
  );
}
