import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

const mockPrisma = {
  feedback: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendFeedbackNotification: vi.fn().mockResolvedValue(undefined) }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

import { requireAuth } from "@/lib/api-auth";
import { sendFeedbackNotification } from "@/lib/email";
import { logAudit } from "@/lib/audit";

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

const mockFeedback = {
  id: "f-1",
  name: "Jane",
  email: "jane@test.com",
  company: "Inc",
  rating: 5,
  comment: "Great!",
  isVisible: true,
  createdAt: new Date("2026-01-01"),
};

beforeEach(() => vi.clearAllMocks());

describe("GET /api/feedback", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("returns paginated feedbacks", async () => {
    mockPrisma.feedback.findMany.mockResolvedValue([mockFeedback]);
    mockPrisma.feedback.count.mockResolvedValue(1);
    const { GET } = await import("@/app/api/feedback/route");
    const res = await GET(req("http://localhost/api/feedback"));
    const data = await res.json();
    expect(data.data).toHaveLength(1);
    expect(data.total).toBe(1);
  });

  it("filters by rating", async () => {
    mockPrisma.feedback.findMany.mockResolvedValue([]);
    mockPrisma.feedback.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/feedback/route");
    await GET(req("http://localhost/api/feedback?rating=5"));
    expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ rating: 5 }) }),
    );
  });

  it("filters by visibility", async () => {
    mockPrisma.feedback.findMany.mockResolvedValue([]);
    mockPrisma.feedback.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/feedback/route");
    await GET(req("http://localhost/api/feedback?visibility=visible"));
    expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isVisible: true }) }),
    );
  });

  it("applies search filter", async () => {
    mockPrisma.feedback.findMany.mockResolvedValue([]);
    mockPrisma.feedback.count.mockResolvedValue(0);
    const { GET } = await import("@/app/api/feedback/route");
    await GET(req("http://localhost/api/feedback?search=jane"));
    expect(mockPrisma.feedback.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            expect.objectContaining({ name: expect.objectContaining({ contains: "jane" }) }),
          ]),
        }),
      }),
    );
  });

  it("returns 401 when not authenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockNoAuth() as any);
    const { GET } = await import("@/app/api/feedback/route");
    const res = await GET(req("http://localhost/api/feedback"));
    expect(res.status).toBe(401);
  });
});

describe("POST /api/feedback", () => {
  it("creates feedback and sends notification", async () => {
    mockPrisma.feedback.create.mockResolvedValue(mockFeedback);
    const { POST } = await import("@/app/api/feedback/route");
    const res = await POST(
      req("http://localhost/api/feedback", "POST", {
        name: "Jane",
        email: "jane@test.com",
        company: "Inc",
        rating: "5",
        comment: "Great!",
      }),
    );
    expect(res.status).toBe(201);
    expect(sendFeedbackNotification).toHaveBeenCalled();
  });

  it("returns 400 when required fields missing", async () => {
    const { POST } = await import("@/app/api/feedback/route");
    const res = await POST(req("http://localhost/api/feedback", "POST", { name: "Jane" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when rating out of range", async () => {
    const { POST } = await import("@/app/api/feedback/route");
    const res = await POST(
      req("http://localhost/api/feedback", "POST", {
        name: "Jane",
        email: "j@test.com",
        rating: "10",
        comment: "x",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 when rating is not a number", async () => {
    const { POST } = await import("@/app/api/feedback/route");
    const res = await POST(
      req("http://localhost/api/feedback", "POST", {
        name: "Jane",
        email: "j@test.com",
        rating: "abc",
        comment: "x",
      }),
    );
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/feedback", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("toggles visibility", async () => {
    mockPrisma.feedback.findUnique.mockResolvedValue({ isVisible: true, name: "Jane" });
    mockPrisma.feedback.update.mockResolvedValue({ ...mockFeedback, isVisible: false });
    const { PATCH } = await import("@/app/api/feedback/route");
    const res = await PATCH(
      req("http://localhost/api/feedback", "PATCH", { id: "f-1", is_visible: false }),
    );
    expect(res.status).toBe(200);
    expect(logAudit).toHaveBeenCalled();
  });

  it("returns 400 when missing fields", async () => {
    const { PATCH } = await import("@/app/api/feedback/route");
    const res = await PATCH(req("http://localhost/api/feedback", "PATCH", { id: "f-1" }));
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/feedback", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("deletes feedback", async () => {
    mockPrisma.feedback.findUnique.mockResolvedValue(mockFeedback);
    mockPrisma.feedback.delete.mockResolvedValue({});
    const { DELETE } = await import("@/app/api/feedback/route");
    const res = await DELETE(req("http://localhost/api/feedback?id=f-1"));
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(logAudit).toHaveBeenCalled();
  });

  it("returns 400 when id missing", async () => {
    const { DELETE } = await import("@/app/api/feedback/route");
    const res = await DELETE(req("http://localhost/api/feedback"));
    expect(res.status).toBe(400);
  });
});
