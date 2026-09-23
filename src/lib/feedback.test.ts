import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fire: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: mocks.fire,
  },
}));

import {
  confirmDestructiveAction,
  showError,
  showSuccess,
} from "./feedback";

describe("feedback", () => {
  beforeEach(() => {
    mocks.fire.mockReset();
  });

  it("shows a success message", () => {
    showSuccess("Success", "Operation completed successfully");

    expect(mocks.fire).toHaveBeenCalledTimes(1);
  });

  it("shows an error message", () => {
    showError("Error", "Something went wrong");

    expect(mocks.fire).toHaveBeenCalledTimes(1);
  });

  it("returns true when the destructive action is confirmed", async () => {
    mocks.fire.mockResolvedValueOnce({ isConfirmed: true });

    const result = await confirmDestructiveAction({
      title: "Are you sure?",
      text: "This action cannot be undone",
      confirmText: "Yes, continue",
    });

    expect(mocks.fire).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it("returns false when the destructive action is cancelled", async () => {
    mocks.fire.mockResolvedValueOnce({ isConfirmed: false });

    const result = await confirmDestructiveAction({
      title: "Are you sure?",
      text: "This action cannot be undone",
      confirmText: "Yes, continue",
    });

    expect(result).toBe(false);
  });
});
