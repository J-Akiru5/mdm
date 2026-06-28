import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryNotification } from "@/lib/email";
import { requireAuth } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get("page");
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const page = Math.max(1, parseInt(pageParam ?? "1", 10));
    const search = searchParams.get("search")?.trim() ?? "";
    const eventType = searchParams.get("eventType") ?? "";

    const where: Prisma.ContactSubmissionWhereInput = {};

    if (eventType) {
      where.eventType = eventType;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, submissions] = await Promise.all([
      prisma.contactSubmission.count({ where }),
      prisma.contactSubmission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const data = submissions.map((s) => ({
      id: s.id,
      full_name: s.fullName,
      email: s.email,
      phone: s.phone,
      company: s.company,
      event_type: s.eventType,
      event_date: s.eventDate,
      message: s.message,
      created_at: s.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, company, eventType, eventDate, message } = body;

    if (!fullName || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        fullName,
        email,
        phone: phone || null,
        company: company || null,
        eventType: eventType || null,
        eventDate: eventDate || null,
        message: message || "",
      },
    });

    sendInquiryNotification({
      fullName: submission.fullName,
      email: submission.email,
      phone: submission.phone,
      company: submission.company,
      eventType: submission.eventType,
      eventDate: submission.eventDate,
      message: submission.message,
    }).catch(console.error);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
