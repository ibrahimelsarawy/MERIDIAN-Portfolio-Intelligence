import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";

describe("WidgetErrorBoundary behavior", () => {
  it("renders fallback and retry button after an error state", () => {
    const boundary = new WidgetErrorBoundary({
      widgetName: "Risk",
      children: <div>Widget content</div>,
    });

    boundary.state = {
      hasError: true,
      error: new Error("Test error"),
    };

    const html = renderToStaticMarkup(boundary.render());

    expect(html).toContain("could not be rendered.");
    expect(html).toContain("Retry");
    expect(html).toContain("<button");
  });

  it("logs caught errors", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const boundary = new WidgetErrorBoundary({
      widgetName: "Risk",
      children: <div>Widget content</div>,
    });

    const error = new Error("Test error");

    boundary.componentDidCatch(error, {
      componentStack: "test stack",
    });

    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
