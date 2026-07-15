import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useTable<T>(table: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase
      .from(table)
      .select("*")
      .order("sort_order")
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else setData((data ?? []) as T[]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [table]);

  return { data, loading, error };
}
