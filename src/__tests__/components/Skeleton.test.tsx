import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Skeleton from "@/components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders with default props", () => {
    render(<Skeleton />);
    const skeleton = document.querySelector(".skeleton");
    expect(skeleton).not.toBeNull();
    expect(skeleton?.tagName).toBe("DIV");
  });

  it("applies custom width and height", () => {
    render(<Skeleton width={200} height={40} />);
    const skeleton = document.querySelector(".skeleton");
    const style = skeleton?.getAttribute("style");
    expect(style).toContain("200");
    expect(style).toContain("40");
  });

  it("applies custom className", () => {
    render(<Skeleton className="custom-skeleton" />);
    const skeleton = document.querySelector(".skeleton");
    expect(skeleton?.className).toContain("custom-skeleton");
  });

  it("applies custom borderRadius", () => {
    render(<Skeleton borderRadius="50%" />);
    const skeleton = document.querySelector(".skeleton");
    const style = skeleton?.getAttribute("style");
    expect(style).toContain("50%");
  });

  it("renders with custom style override", () => {
    render(<Skeleton style={{ marginTop: "10px" }} />);
    const skeleton = document.querySelector(".skeleton");
    const style = skeleton?.getAttribute("style");
    expect(style).toContain("10px");
  });
});
