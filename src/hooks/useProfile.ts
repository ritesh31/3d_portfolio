import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ProfileRow } from "../types";

export function useProfile() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from("profile")
      .select("*")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        setProfile(data);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading, error };
}
