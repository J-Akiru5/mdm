import { describe, it, expect, vi, beforeEach } from "vitest";
import { logAudit } from "@/lib/audit";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    auditLog: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("logAudit", () => {
  it("creates an audit log entry with correct data", async () => {
    const mockCreate = vi.fn().mockResolvedValue({});
    (prisma.auditLog.create as ReturnType<typeof vi.fn>).mockImplementation(mockCreate);

    await logAudit({
      action: "LOGIN",
      entity: "session",
      actorId: "user-123",
      actorEmail: "test@example.com",
      ipAddress: "127.0.0.1",
      userAgent: "Mozilla/5.0",
    });

    expect(mockCreate).toHaveBeenCalledOnce();
    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.action).toBe("LOGIN");
    expect(callArg.data.entity).toBe("session");
    expect(callArg.data.actorId).toBe("user-123");
    expect(callArg.data.actorEmail).toBe("test@example.com");
    expect(callArg.data.ipAddress).toBe("127.0.0.1");
  });

  it("converts before/after objects to JSON", async () => {
    const mockCreate = vi.fn().mockResolvedValue({});
    (prisma.auditLog.create as ReturnType<typeof vi.fn>).mockImplementation(mockCreate);

    await logAudit({
      action: "UPDATE",
      entity: "portfolio",
      entityId: "p-1",
      before: { title: "Old Title" },
      after: { title: "New Title" },
    });

    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.before).toEqual({ title: "Old Title" });
    expect(callArg.data.after).toEqual({ title: "New Title" });
  });

  it("never throws even if prisma fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    (prisma.auditLog.create as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("DB connection failed"),
    );

    await expect(logAudit({ action: "CREATE", entity: "portfolio" })).resolves.toBeUndefined();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("nullifies optional fields when not provided", async () => {
    const mockCreate = vi.fn().mockResolvedValue({});
    (prisma.auditLog.create as ReturnType<typeof vi.fn>).mockImplementation(mockCreate);

    await logAudit({
      action: "DELETE",
      entity: "feedback",
      entityId: "f-1",
    });

    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.data.actorId).toBeNull();
    expect(callArg.data.actorEmail).toBeNull();
    expect(callArg.data.before).toBeUndefined();
    expect(callArg.data.after).toBeUndefined();
  });
});
