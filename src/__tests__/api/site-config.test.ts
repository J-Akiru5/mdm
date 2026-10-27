import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextResponse } from "next/server";

const mockPrisma = {
  siteConfig: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
};

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/lib/api-auth", () => ({ requireAuth: vi.fn() }));
vi.mock("@/lib/audit", () => ({ logAudit: vi.fn() }));

import { requireAuth } from "@/lib/api-auth";
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

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireAuth).mockResolvedValue(mockAuth() as any);
});

afterEach(() => vi.restoreAllMocks());

describe("GET /api/site-config/public", () => {
  it("defaults to hiding testimonials when no value is stored", async () => {
    mockPrisma.siteConfig.findMany.mockResolvedValue([]);
    const { GET } = await import("@/app/api/site-config/public/route");
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data.show_testimonials).toBe("false");
  });

  it("returns the stored value when one exists", async () => {
    mockPrisma.siteConfig.findMany.mockResolvedValue([{ key: "show_testimonials", value: "true" }]);
    const { GET } = await import("@/app/api/site-config/public/route");
    const res = await GET();
    const data = await res.json();
    expect(data.data.show_testimonials).toBe("true");
  });

  it("only exposes whitelisted keys", async () => {
    mockPrisma.siteConfig.findMany.mockResolvedValue([
      { key: "show_testimonials", value: "true" },
      { key: "some_secret_setting", value: "leak" },
    ]);
    const { GET } = await import("@/app/api/site-config/public/route");
    const res = await GET();
    const data = await res.json();
    expect(data.data).toEqual({ show_testimonials: "true" });
  });

  it("falls back to defaults when the database read fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockPrisma.siteConfig.findMany.mockRejectedValue(new Error("db down"));
    const { GET } = await import("@/app/api/site-config/public/route");
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data.show_testimonials).toBe("false");
  });
});

describe("GET /api/admin/site-config", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockNoAuth() as any);
    const { GET } = await import("@/app/api/admin/site-config/route");
    const res = await GET(req("http://localhost/api/admin/site-config"));
    expect(res.status).toBe(401);
  });

  it("returns stored values merged over defaults", async () => {
    mockPrisma.siteConfig.findMany.mockResolvedValue([{ key: "show_testimonials", value: "true" }]);
    const { GET } = await import("@/app/api/admin/site-config/route");
    const res = await GET(req("http://localhost/api/admin/site-config"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data.show_testimonials).toBe("true");
  });
});

describe("PATCH /api/admin/site-config", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(requireAuth).mockResolvedValue(mockNoAuth() as any);
    const { PATCH } = await import("@/app/api/admin/site-config/route");
    const res = await PATCH(
      req("http://localhost/api/admin/site-config", "PATCH", {
        key: "show_testimonials",
        value: "true",
      }),
    );
    expect(res.status).toBe(401);
  });

  it("rejects unknown config keys", async () => {
    const { PATCH } = await import("@/app/api/admin/site-config/route");
    const res = await PATCH(
      req("http://localhost/api/admin/site-config", "PATCH", {
        key: "some_unknown_setting",
        value: "true",
      }),
    );
    expect(res.status).toBe(400);
    expect(mockPrisma.siteConfig.upsert).not.toHaveBeenCalled();
  });

  it("rejects non-string values", async () => {
    const { PATCH } = await import("@/app/api/admin/site-config/route");
    const res = await PATCH(
      req("http://localhost/api/admin/site-config", "PATCH", {
        key: "show_testimonials",
        value: true,
      }),
    );
    expect(res.status).toBe(400);
  });

  it("upserts the value and records an audit entry", async () => {
    mockPrisma.siteConfig.findUnique.mockResolvedValue({
      key: "show_testimonials",
      value: "false",
    });
    mockPrisma.siteConfig.upsert.mockResolvedValue({});
    const { PATCH } = await import("@/app/api/admin/site-config/route");
    const res = await PATCH(
      req("http://localhost/api/admin/site-config", "PATCH", {
        key: "show_testimonials",
        value: "true",
      }),
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockPrisma.siteConfig.upsert).toHaveBeenCalledWith({
      where: { key: "show_testimonials" },
      update: { value: "true" },
      create: { key: "show_testimonials", value: "true" },
    });
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "UPDATE",
        entity: "SiteConfig",
        entityId: "show_testimonials",
        before: { value: "false" },
        after: { value: "true" },
      }),
    );
  });
});
