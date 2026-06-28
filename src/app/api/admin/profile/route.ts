import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  return NextResponse.json({
    email: auth.user.email,
    fullName: auth.user.user_metadata?.full_name ?? "",
    avatarUrl: auth.user.user_metadata?.avatar_url ?? "",
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { fullName, avatarUrl } = body;

  const { error } = await auth.supabase.auth.updateUser({
    data: {
      full_name: fullName ?? auth.user.user_metadata?.full_name,
      avatar_url: avatarUrl ?? auth.user.user_metadata?.avatar_url,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
