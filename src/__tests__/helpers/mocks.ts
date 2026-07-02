import { vi } from "vitest";

const mockPrisma = {
  portfolio: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  portfolioImage: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  contactSubmission: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
  feedback: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
  notificationRecipient: {
    findMany: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendInquiryNotification: vi.fn(),
  sendFeedbackNotification: vi.fn(),
}));

vi.mock("@/lib/api-auth", () => ({
  requireAuth: vi.fn(),
}));

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { sendInquiryNotification, sendFeedbackNotification } from "@/lib/email";
import { requireAuth } from "@/lib/api-auth";

export { mockPrisma, logAudit, sendInquiryNotification, sendFeedbackNotification, requireAuth };

export function mockAuthSuccess() {
  return {
    user: { id: "user-1", email: "admin@test.com", user_metadata: {} },
    supabase: {},
  };
}

export function mockAuthFailure() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
}

export function mockRequest(
  url: string,
  options?: { method?: string; body?: unknown; headers?: Record<string, string> },
) {
  const headers = new Headers(options?.headers ?? {});
  headers.set("user-agent", "test-agent");
  headers.set("x-forwarded-for", "127.0.0.1");

  return new Request(url, {
    method: options?.method ?? "GET",
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  });
}
