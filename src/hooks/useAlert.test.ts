import { describe, it, expect, vi, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import useAlert from "./useAlert";

describe("useAlert", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts hidden", () => {
    const { result } = renderHook(() => useAlert());
    expect(result.current.alert.show).toBe(false);
  });

  it("showAlert sets text, type and show", () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showAlert({ text: "Saved", type: "success" });
    });

    expect(result.current.alert).toEqual({
      show: true,
      text: "Saved",
      type: "success",
    });
  });

  it("defaults type to danger when omitted", () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showAlert({ text: "Oops" });
    });

    expect(result.current.alert.type).toBe("danger");
  });

  it("hideAlert clears the alert", () => {
    const { result } = renderHook(() => useAlert());

    act(() => {
      result.current.showAlert({ text: "Saved", type: "success" });
    });
    act(() => {
      result.current.hideAlert();
    });

    expect(result.current.alert.show).toBe(false);
  });

  it("auto-hides after the given delay", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAlert(3000));

    act(() => {
      result.current.showAlert({ text: "Saved", type: "success" });
    });
    expect(result.current.alert.show).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.alert.show).toBe(false);
  });
});
