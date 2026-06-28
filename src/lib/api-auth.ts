import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export interface AuthResult {
  user: { id: string; email: string; user_metadata: Record<string, unknown> };
}

export async function requireAuth(request?: Request): Promise<AuthResult | NextResponse> {
  if (!request) {
    return NextResponse.json({ error: "Bad request" }, { status: 500 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get("cookie") ?? "";
          return cookieHeader
            .split(";")
            .filter(Boolean)
            .map((c) => {
              const [name, ...rest] = c.trim().split("=");
              return { name, value: rest.join("=") };
            });
        },
        setAll() {},
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      user_metadata: (user.user_metadata as Record<string, unknown>) ?? {},
    },
  };
}
