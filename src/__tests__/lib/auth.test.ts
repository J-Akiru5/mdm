import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextResponse } from "next/server";

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from "@supabase/ssr";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
});

function mockSupabase(user: { id: string; email: string } | null, error?: Error) {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user }, error: error ?? null }),
    },
  };
}

function createReq(cookies?: string) {
  const headers = new Headers();
  if (cookies) headers.set("cookie", cookies);
  return new Request("http://localhost/api/test", { headers });
}

describe("requireAuth", () => {
  it("returns 500 when request is undefined", async () => {
    const { requireAuth } = await import("@/lib/api-auth");
    const res = await requireAuth(undefined);
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(500);
  });

  it("returns 401 when user not authenticated", async () => {
    vi.mocked(createServerClient).mockReturnValue(
      mockSupabase(null, new Error("Not authenticated")) as any,
    );
    const { requireAuth } = await import("@/lib/api-auth");
    const res = await requireAuth(createReq());
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(401);
  });

  it("returns 401 when user is null", async () => {
    vi.mocked(createServerClient).mockReturnValue(mockSupabase(null) as any);
    const { requireAuth } = await import("@/lib/api-auth");
    const res = await requireAuth(createReq());
    expect(res).toBeInstanceOf(NextResponse);
    expect((res as NextResponse).status).toBe(401);
  });

  it("returns auth result with user when authenticated", async () => {
    const user = { id: "user-1", email: "test@test.com", user_metadata: { role: "admin" } };
    vi.mocked(createServerClient).mockReturnValue(mockSupabase(user) as any);
    const { requireAuth } = await import("@/lib/api-auth");
    const result = await requireAuth(createReq("sb-access-token=abc"));
    expect(result).not.toBeInstanceOf(NextResponse);
    expect((result as any).user.id).toBe("user-1");
    expect((result as any).user.email).toBe("test@test.com");
  });

  it("creates supabase client with cookie parsing", async () => {
    const user = { id: "user-1", email: "test@test.com", user_metadata: {} };
    vi.mocked(createServerClient).mockReturnValue(mockSupabase(user) as any);
    const { requireAuth } = await import("@/lib/api-auth");
    await requireAuth(createReq("token1=abc; token2=xyz"));
    expect(createServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({ getAll: expect.any(Function) }),
      }),
    );
  });

  it("handles missing email gracefully", async () => {
    vi.mocked(createServerClient).mockReturnValue(
      mockSupabase({ id: "u-1", email: null as any }) as any,
    );
    const { requireAuth } = await import("@/lib/api-auth");
    const result = await requireAuth(createReq());
    expect((result as any).user.email).toBe("");
  });
});
