import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AuditAction = "LOGIN" | "LOGIN_FAILED" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";

export interface AuditParams {
  action: AuditAction;
  entity: string;
  entityId?: string;
  actorId?: string;
  actorEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

function toJson(obj: Record<string, unknown> | undefined): Prisma.InputJsonValue | undefined {
  if (!obj) return undefined;
  // Round-trip through JSON to satisfy Prisma's InputJsonValue type
  return JSON.parse(JSON.stringify(obj)) as Prisma.InputJsonValue;
}

/**
 * Fire-and-forget audit logger.
 * Never throws — a logging failure must never break the caller's flow.
 */
export async function logAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId ?? null,
        actorId: params.actorId ?? null,
        actorEmail: params.actorEmail ?? null,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
        before: toJson(params.before),
        after: toJson(params.after),
        metadata: toJson(params.metadata),
      },
    });
  } catch (err) {
    // Intentionally silent — audit log failures must not break primary flows
    console.error("[audit] Failed to write audit log:", err);
  }
}
