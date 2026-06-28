import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export interface AuthResult {
  user: { id: string; email: string };
}

export async function requireAuth(req: NextRequest): Promise<AuthResult | NextResponse> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
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

  return { user: { id: user.id, email: user.email ?? "" } };
}
