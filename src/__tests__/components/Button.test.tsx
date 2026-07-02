import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders with default primary variant", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeDefined();
    expect(button.tagName).toBe("BUTTON");
  });

  it("renders as anchor when as='a' and href provided", () => {
    render(
      <Button as="a" href="/about">
        About
      </Button>,
    );
    const link = screen.getByRole("link", { name: /about/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/about");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("renders disabled state", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Styled</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });

  it("applies submit type correctly", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button.getAttribute("type")).toBe("submit");
  });
});
