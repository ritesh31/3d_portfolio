import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CTA from "./CTA";

describe("CTA", () => {
  it("links to the contacts page", () => {
    render(<CTA />, { wrapper: MemoryRouter });

    const link = screen.getByRole("link", { name: "Contact" });
    expect(link).toHaveAttribute("href", "/contacts");
  });
});
