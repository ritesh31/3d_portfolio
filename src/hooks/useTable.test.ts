import { describe, it, expect, vi } from "vitest";
import { waitFor, renderHook } from "@testing-library/react";
import { useTable } from "./useTable";
import { supabase } from "../lib/supabase";

type Row = { id: string; name: string };

function mockSelect(result: { data: Row[] | null; error: { message: string } | null }) {
  const order = vi.fn().mockResolvedValue(result);
  const select = vi.fn().mockReturnValue({ order });
  vi.spyOn(supabase, "from").mockReturnValue({ select } as never);
  return { select, order };
}

describe("useTable", () => {
  it("starts in a loading state with empty data", () => {
    mockSelect({ data: [], error: null });
    const { result } = renderHook(() => useTable<Row>("skills"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it("loads rows from the given table", async () => {
    const rows: Row[] = [{ id: "1", name: "React" }];
    const { select } = mockSelect({ data: rows, error: null });

    const { result } = renderHook(() => useTable<Row>("skills"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(select).toHaveBeenCalledWith("*");
    expect(supabase.from).toHaveBeenCalledWith("skills");
    expect(result.current.data).toEqual(rows);
    expect(result.current.error).toBeNull();
  });

  it("surfaces the error message and empty data on failure", async () => {
    mockSelect({ data: null, error: { message: "boom" } });

    const { result } = renderHook(() => useTable<Row>("skills"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("boom");
    expect(result.current.data).toEqual([]);
  });
});
