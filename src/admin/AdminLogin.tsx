import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthSession } from "./useAuthSession";

function AdminLogin() {
  const { session, loading } = useAuthSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSubmitting(false);
    if (signInError) setError(signInError.message);
  };

  return (
    <section className="max-container flex items-center justify-center min-h-[70vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-5"
      >
        <h1 className="head-text">Admin Login</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Email
          <input
            type="email"
            className="input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Password
          <input
            type="password"
            className="input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}

export default AdminLogin;
