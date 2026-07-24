import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";

describe("Alert", () => {
  it("renders the message text", () => {
    render(<Alert text="Saved successfully" type="success" />);
    expect(screen.getByText("Saved successfully")).toBeInTheDocument();
  });

  it("labels a danger alert as Failed", () => {
    render(<Alert text="Something broke" type="danger" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("labels a non-danger alert as Success", () => {
    render(<Alert text="All good" type="success" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
