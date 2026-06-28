"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

async function getRequestMeta() {
  const headersList = await headers();
  return {
    ipAddress:
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
      headersList.get("x-real-ip") ??
      undefined,
    userAgent: headersList.get("user-agent") ?? undefined,
  };
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(data);
  const meta = await getRequestMeta();

  if (error || !authData.user) {
    // Log failed login attempt (fire-and-forget)
    logAudit({
      action: "LOGIN_FAILED",
      entity: "Auth",
      actorEmail: data.email,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      metadata: { reason: error?.message ?? "Unknown error" },
    });
    redirect("/admin/login?error=invalid_credentials");
  }

  // Log successful login (fire-and-forget)
  logAudit({
    action: "LOGIN",
    entity: "Auth",
    actorId: authData.user.id,
    actorEmail: authData.user.email ?? data.email,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    metadata: { provider: "email" },
  });

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const meta = await getRequestMeta();

  await supabase.auth.signOut();

  // Log logout (fire-and-forget)
  if (user) {
    logAudit({
      action: "LOGOUT",
      entity: "Auth",
      actorId: user.id,
      actorEmail: user.email,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  }

  revalidatePath("/admin/login");
  redirect("/admin/login");
}
