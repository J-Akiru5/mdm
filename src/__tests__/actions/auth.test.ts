import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("@/lib/audit", () => ({
  logAudit: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue({
    get: (name: string) => {
      if (name === "x-forwarded-for") return "127.0.0.1";
      if (name === "user-agent") return "test-agent";
      return null;
    },
  }),
}));

import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

function mockSupabaseClient(options?: {
  signInResult?: { data: { user: null }; error: { message: string } } | null;
  getUserResult?: { data: { user: { id: string; email: string } | null } };
}) {
  return {
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue(
        options?.signInResult ?? {
          data: {
            user: { id: "user-1", email: "admin@test.com" },
            session: { access_token: "token" },
          },
          error: null,
        },
      ),
      getUser: vi.fn().mockResolvedValue(
        options?.getUserResult ?? {
          data: { user: { id: "user-1", email: "admin@test.com" } },
        },
      ),
      signOut: vi.fn().mockResolvedValue({}),
    },
  };
}

function createFormData(data: Record<string, string>) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("login server action", () => {
  it("logs successful login and redirects to admin", async () => {
    vi.mocked(createClient).mockResolvedValue(mockSupabaseClient() as any);

    const { login } = await import("@/app/actions/auth");
    const formData = createFormData({ email: "admin@test.com", password: "password123" });

    await expect(login(formData)).rejects.toThrow("REDIRECT:/admin");
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({ action: "LOGIN", entity: "Auth" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin");
  });

  it("logs failed login and redirects to login with error", async () => {
    vi.mocked(createClient).mockResolvedValue(
      mockSupabaseClient({
        signInResult: {
          data: { user: null },
          error: { message: "Invalid login credentials" },
        },
      }) as any,
    );

    const { login } = await import("@/app/actions/auth");
    const formData = createFormData({ email: "wrong@test.com", password: "wrongpass" });

    await expect(login(formData)).rejects.toThrow(
      "REDIRECT:/admin/login?error=invalid_credentials",
    );
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({ action: "LOGIN_FAILED", entity: "Auth" }),
    );
  });
});

describe("logout server action", () => {
  it("signs out and redirects to login", async () => {
    vi.mocked(createClient).mockResolvedValue(mockSupabaseClient() as any);

    const { logout } = await import("@/app/actions/auth");
    await expect(logout()).rejects.toThrow("REDIRECT:/admin/login");
    expect(logAudit).toHaveBeenCalledWith(
      expect.objectContaining({ action: "LOGOUT", entity: "Auth" }),
    );
    expect(revalidatePath).toHaveBeenCalledWith("/admin/login");
  });

  it("handles logout without user gracefully", async () => {
    vi.mocked(createClient).mockResolvedValue(
      mockSupabaseClient({
        getUserResult: { data: { user: null } },
      }) as any,
    );

    const { logout } = await import("@/app/actions/auth");
    await expect(logout()).rejects.toThrow("REDIRECT:/admin/login");
    expect(logAudit).not.toHaveBeenCalled();
  });
});
