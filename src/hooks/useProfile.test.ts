import { describe, it, expect, vi } from "vitest";
import { waitFor, renderHook } from "@testing-library/react";
import { useProfile } from "./useProfile";
import { supabase } from "../lib/supabase";
import { ProfileRow } from "../types";

function mockProfileQuery(result: { data: ProfileRow | null; error: { message: string } | null }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  vi.spyOn(supabase, "from").mockReturnValue({ select } as never);
  return { select, eq, maybeSingle };
}

const profile: ProfileRow = {
  id: 1,
  name: "Ritesh",
  tagline: "Lead Engineer",
  bio: "Bio",
  info_stage_2: "",
  info_stage_3: "",
  info_stage_4: "",
  resume_url: null,
  updated_at: "2026-01-01T00:00:00.000Z",
};

describe("useProfile", () => {
  it("starts loading with no profile", () => {
    mockProfileQuery({ data: profile, error: null });
    const { result } = renderHook(() => useProfile());

    expect(result.current.loading).toBe(true);
    expect(result.current.profile).toBeNull();
  });

  it("loads the single profile row (id = 1)", async () => {
    const { eq } = mockProfileQuery({ data: profile, error: null });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(eq).toHaveBeenCalledWith("id", 1);
    expect(result.current.profile).toEqual(profile);
    expect(result.current.error).toBeNull();
  });

  it("surfaces the error message on failure", async () => {
    mockProfileQuery({ data: null, error: { message: "boom" } });

    const { result } = renderHook(() => useProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("boom");
    expect(result.current.profile).toBeNull();
  });
});
