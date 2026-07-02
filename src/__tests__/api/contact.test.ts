import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

const mockPrisma = {
  contactSubmission: {
    findMany: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendInquiryNotification: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

import { requireAuth } from "@/lib/api-auth";
import { sendInquiryNotification } from "@/lib/email";

function mockAuth() {
  return { user: { id: "user-1", email: "admin@test.com", user_metadata: {} }, supabase: {} };
}

function mockNoAuth() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function req(url: string, method = "GET", body?: unknown) {
  const headers = new Headers({ "user-agent": "test", "x-forwarded-for": "127.0.0.1" });
  return new Request(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }) as any;
}

const mockSubmission = {
  id: "c-1",
  fullName: "John",
  email: "john@test.com",
  phone: "+123",
  company: "Corp",
  eventType: "wedding",
  eventDate: "2026-06-01",
  message: "Hi!",
  createdAt: new Date("2026-01-01"),
};

beforeEach(() => vi.clearAllMocks());

describe("GET /api/contact", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("returns paginated submissions", async () => {
    mockPrisma.contactSubmission.findMany.mockResolvedValue([mockSubmission]);
    mockPrisma.contactSubmission.count.mockResolvedValue(1);
    const { GET } = await import("@/app/api/contact/route");
    const res = await GET(req("http://localhost/api/contact"));
    const data = await res.json();
    expect(data.data).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it("applies search filter", async () => {
    mockPrisma.contactSubmission.findMany.mockResolvedValue([]);
    mockPrisma.contactSubmission.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/contact/route");
    await GET(req("http://localhost/api/contact?search=john"));
    expect(mockPrisma.contactSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ fullName: expect.objectContaining({ contains: "john" }) }),
          ]),
        }),
      }),
    );
  });

  it("applies eventType filter", async () => {
    mockPrisma.contactSubmission.findMany.mockResolvedValue([]);
    mockPrisma.contactSubmission.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/contact/route");
    await GET(req("http://localhost/api/contact?eventType=wedding"));
    expect(mockPrisma.contactSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ eventType: "wedding" }) }),
    );
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockNoAuth() as any);
    const { GET } = await import("@/app/api/contact/route");
    const res = await GET(req("http://localhost/api/contact"));
    expect(res.status).toBe(401);
  });

  it("limits page size to 100", async () => {
    mockPrisma.contactSubmission.findMany.mockResolvedValue([]);
    mockPrisma.contactSubmission.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/contact/route");
    await GET(req("http://localhost/api/contact?limit=200"));
    expect(mockPrisma.contactSubmission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 100 }),
    );
  });
});

describe("POST /api/contact", () => {
  it("creates submission and sends notification", async () => {
    mockPrisma.contactSubmission.create.mockResolvedValue(mockSubmission);
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(
      req("http://localhost/api/contact", "POST", {
        fullName: "John",
        email: "john@test.com",
        phone: "+123",
        company: "Corp",
        eventType: "wedding",
        eventDate: "2026-06-01",
        message: "Hi!",
      }),
    );
    expect(res.status).toBe(201);
    expect(sendInquiryNotification).toHaveBeenCalled();
  });

  it("returns 400 when name or email missing", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const res = await POST(req("http://localhost/api/contact", "POST", { fullName: "John" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 on invalid JSON", async () => {
    const { POST } = await import("@/app/api/contact/route");
    const badReq = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "invalid",
    });
    const res = await POST(badReq as any);
    expect(res.status).toBe(400);
  });
});
