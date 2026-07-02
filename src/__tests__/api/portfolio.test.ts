import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

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
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));
vi.mock("@/lib/email", () => ({
  sendInquiryNotification: vi.fn(),
  sendFeedbackNotification: vi.fn(),
}));
vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));

import { logAudit } from "@/lib/audit";
import { requireAuth } from "@/lib/api-auth";

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

const mockPortfolio = {
  id: "p-1",
  title: "Test",
  category: "wedding",
  imageUrl: "/img.jpg",
  clientLogo: null,
  clientName: "Client",
  challenge: "c",
  solution: "s",
  result: "r",
  highlight: false,
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-02"),
  updatedByEmail: "admin@test.com",
  images: [{ id: "img-1", url: "/photo.jpg", sortOrder: 0 }],
};

beforeEach(() => vi.clearAllMocks());

describe("GET /api/portfolio", () => {
  it("returns all items", async () => {
    mockPrisma.portfolio.findMany.mockResolvedValue([mockPortfolio]);
    const { GET } = await import("@/app/api/portfolio/route");
    const res = await GET(req("http://localhost/api/portfolio"));
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Test");
  });

  it("filters by highlight", async () => {
    mockPrisma.portfolio.findMany.mockResolvedValue([]);
    const { GET } = await import("@/app/api/portfolio/route");
    await GET(req("http://localhost/api/portfolio?highlight=true"));
    expect(mockPrisma.portfolio.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { highlight: true } }),
    );
  });

  it("returns 500 on error", async () => {
    mockPrisma.portfolio.findMany.mockRejectedValue(new Error("DB"));
    const { GET } = await import("@/app/api/portfolio/route");
    const res = await GET(req("http://localhost/api/portfolio"));
    expect(res.status).toBe(500);
  });
});

describe("POST /api/portfolio", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("creates item when authenticated", async () => {
    mockPrisma.portfolio.create.mockResolvedValue(mockPortfolio);
    const { POST } = await import("@/app/api/portfolio/route");
    const res = await POST(
      req("http://localhost/api/portfolio", "POST", {
        title: "Test",
        category: "wedding",
        image_url: "/img.jpg",
        images: [{ url: "/photo.jpg", sort_order: 0 }],
      }),
    );
    expect(res.status).toBe(201);
    expect(logAudit).toHaveBeenCalled();
  });

  it("returns 401 when unauthenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockNoAuth() as any);
    const { POST } = await import("@/app/api/portfolio/route");
    const res = await POST(req("http://localhost/api/portfolio", "POST", { title: "Test" }));
    expect(res.status).toBe(401);
  });

  it("returns 500 on db error", async () => {
    mockPrisma.portfolio.create.mockRejectedValue(new Error("DB"));
    const { POST } = await import("@/app/api/portfolio/route");
    const res = await POST(
      req("http://localhost/api/portfolio", "POST", { title: "T", category: "c" }),
    );
    expect(res.status).toBe(500);
  });
});

describe("PUT /api/portfolio", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("updates item with images", async () => {
    mockPrisma.portfolio.findUnique.mockResolvedValue(mockPortfolio);
    mockPrisma.portfolio.update.mockResolvedValue(mockPortfolio);
    mockPrisma.portfolioImage.deleteMany.mockResolvedValue({});
    mockPrisma.portfolioImage.createMany.mockResolvedValue({});
    const { PUT } = await import("@/app/api/portfolio/route");
    const res = await PUT(
      req("http://localhost/api/portfolio", "PUT", {
        id: "p-1",
        title: "Updated",
        category: "corp",
        image_url: "/new.jpg",
        images: [{ url: "/photo.jpg" }],
      }),
    );
    expect(res.status).toBe(200);
    expect(mockPrisma.portfolio.update).toHaveBeenCalled();
  });
});

describe("PATCH /api/portfolio", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("toggles highlight", async () => {
    mockPrisma.portfolio.findUnique.mockResolvedValue({ highlight: false, title: "Test" });
    mockPrisma.portfolio.update.mockResolvedValue({ ...mockPortfolio, highlight: true });
    const { PATCH } = await import("@/app/api/portfolio/route");
    const res = await PATCH(
      req("http://localhost/api/portfolio", "PATCH", { id: "p-1", highlight: true }),
    );
    expect(res.status).toBe(200);
  });

  it("returns 400 when missing fields", async () => {
    const { PATCH } = await import("@/app/api/portfolio/route");
    const res = await PATCH(req("http://localhost/api/portfolio", "PATCH", { id: "p-1" }));
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/portfolio", () => {
  beforeEach(() => vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any));

  it("deletes item", async () => {
    mockPrisma.portfolio.findUnique.mockResolvedValue(mockPortfolio);
    mockPrisma.portfolio.delete.mockResolvedValue({});
    const { DELETE } = await import("@/app/api/portfolio/route");
    const res = await DELETE(req("http://localhost/api/portfolio?id=p-1"));
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(logAudit).toHaveBeenCalled();
  });

  it("returns 400 when id missing", async () => {
    const { DELETE } = await import("@/app/api/portfolio/route");
    const res = await DELETE(req("http://localhost/api/portfolio"));
    expect(res.status).toBe(400);
  });
});
