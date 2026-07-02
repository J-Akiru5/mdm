import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSend = vi.fn().mockResolvedValue({ id: "email-1" });

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
    constructor(_key?: string) {}
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    notificationRecipient: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
  process.env.ADMIN_EMAIL = "admin@mdmevents.org";
  process.env.NEXT_PUBLIC_SITE_URL = "https://mdmevents.org";
});

describe("sendInquiryNotification", () => {
  it("sends email to configured recipients", async () => {
    (prisma.notificationRecipient.findMany as any).mockResolvedValue([
      { email: "user@test.com" },
      { email: "admin@test.com" },
    ]);
    const { sendInquiryNotification } = await import("@/lib/email");
    await sendInquiryNotification({
      fullName: "John",
      email: "john@test.com",
      phone: "+123",
      company: "Corp",
      eventType: "wedding",
      eventDate: "2026-06-01",
      message: "Hi!",
    });
    expect(mockSend).toHaveBeenCalled();
  });

  it("falls back to admin when no recipients", async () => {
    (prisma.notificationRecipient.findMany as any).mockResolvedValue([]);
    const { sendInquiryNotification } = await import("@/lib/email");
    await sendInquiryNotification({
      fullName: "John",
      email: "john@test.com",
      message: "Test",
    });
    expect(mockSend).toHaveBeenCalled();
  });

  it("returns early when RESEND_API_KEY missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendInquiryNotification } = await import("@/lib/email");
    await sendInquiryNotification({
      fullName: "John",
      email: "john@test.com",
      message: "Test",
    });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("handles optional fields", async () => {
    (prisma.notificationRecipient.findMany as any).mockResolvedValue([]);
    const { sendInquiryNotification } = await import("@/lib/email");
    await expect(
      sendInquiryNotification({ fullName: "John", email: "j@t.com", message: "T" }),
    ).resolves.toBeUndefined();
  });

  it("handles db error in getRecipients", async () => {
    (prisma.notificationRecipient.findMany as any).mockRejectedValue(new Error("Table not found"));
    const { sendInquiryNotification } = await import("@/lib/email");
    await expect(
      sendInquiryNotification({ fullName: "John", email: "j@t.com", message: "T" }),
    ).resolves.toBeUndefined();
  });
});

describe("sendFeedbackNotification", () => {
  it("sends email to configured recipients", async () => {
    (prisma.notificationRecipient.findMany as any).mockResolvedValue([{ email: "user@test.com" }]);
    const { sendFeedbackNotification } = await import("@/lib/email");
    await sendFeedbackNotification({
      name: "Jane",
      email: "jane@test.com",
      rating: 5,
      comment: "Great!",
    });
    expect(mockSend).toHaveBeenCalled();
  });

  it("returns early when RESEND_API_KEY missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendFeedbackNotification } = await import("@/lib/email");
    await sendFeedbackNotification({
      name: "Jane",
      email: "jane@test.com",
      rating: 5,
      comment: "Great!",
    });
    expect(mockSend).not.toHaveBeenCalled();
  });
});
