import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mdmevents.org";
const FROM_EMAIL = "MDM Events <notifications@mdmevents.org>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mdmevents.org";
const LOGO_URL = `${SITE_URL}/logo/mdm_logo.png`;
const HEADER_URL = `${SITE_URL}/images/OG/email-header.png`;

async function getRecipients(type: "inquiry" | "feedback"): Promise<string[]> {
  try {
    const recipients = await prisma.notificationRecipient.findMany({
      where: { active: true, types: { has: type } },
      select: { email: true },
    });
    if (recipients.length > 0) {
      return recipients.map((r) => r.email);
    }
  } catch {
    // Table may not exist yet or query failed
  }
  // Fallback so emails never silently break
  return [ADMIN_EMAIL];
}

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0;">
              <img src="${HEADER_URL}" alt="MDM Events Management" width="600" style="display:block;width:100%;height:auto;" />
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="background-color:#ffffff;padding:40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#070707;padding:32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:16px;">
                    <p style="color:#ffffff;font-size:18px;font-weight:700;margin:0 0 4px;letter-spacing:0.5px;">MDM Events Management</p>
                    <p style="color:#b0b0bc;font-size:13px;font-style:italic;margin:0;">Events That Move People, Brands, and Communities.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:4px 0;color:#b0b0bc;font-size:13px;">&#9993; mdmeventsmgt@gmail.com</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#b0b0bc;font-size:13px;">&#9742; +63 908 895 4818 &nbsp;|&nbsp; (033) 323 4864</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0;color:#b0b0bc;font-size:13px;">&#9873; 56 Quezon St. Arevalo, Iloilo City</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;">
                    <p style="color:#666;font-size:11px;margin:0;text-align:center;">
                      &copy; ${new Date().getFullYear()} MDM Events Management. All Rights Reserved.
                      &nbsp;&bull;&nbsp;
                      <a href="${SITE_URL}/privacy" style="color:#999;text-decoration:underline;">Privacy Policy</a>
                      &nbsp;&bull;&nbsp;
                      <a href="${SITE_URL}/terms" style="color:#999;text-decoration:underline;">Terms of Service</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function fieldRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;width:130px;border-bottom:1px solid #f0f0f0;">${label}</td>
      <td style="padding:10px 0;color:#171717;font-size:14px;font-weight:600;vertical-align:top;border-bottom:1px solid #f0f0f0;">${value}</td>
    </tr>`;
}

export async function sendInquiryNotification(inquiry: {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  eventType?: string | null;
  eventDate?: string | null;
  message: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const to = await getRecipients("inquiry");

  const eventType = inquiry.eventType
    ? inquiry.eventType.charAt(0).toUpperCase() + inquiry.eventType.slice(1)
    : "Not specified";

  const fields = [
    fieldRow("Name", inquiry.fullName),
    fieldRow(
      "Email",
      `<a href="mailto:${inquiry.email}" style="color:#9e1115;text-decoration:none;">${inquiry.email}</a>`,
    ),
    inquiry.phone ? fieldRow("Phone", inquiry.phone) : "",
    inquiry.company ? fieldRow("Company", inquiry.company) : "",
    fieldRow("Event Type", eventType),
    inquiry.eventDate ? fieldRow("Event Date", inquiry.eventDate) : "",
  ]
    .filter(Boolean)
    .join("");

  const html = emailWrapper(`
    <h1 style="color:#9e1115;font-size:24px;font-weight:700;margin:0 0 8px;">New Inquiry Received</h1>
    <p style="color:#888;font-size:14px;margin:0 0 32px;">A new event inquiry has been submitted through the website.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${fields}
    </table>

    <div style="background-color:#f8f8f8;border-left:4px solid #9e1115;padding:20px 24px;margin-bottom:32px;">
      <p style="color:#171717;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Message</p>
      <p style="color:#555;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${inquiry.message}</p>
    </div>

    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="background-color:#9e1115;border-radius:0;">
          <a href="${SITE_URL}/admin/inquiries" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">VIEW IN DASHBOARD &rarr;</a>
        </td>
      </tr>
    </table>
  `);

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `New Inquiry from ${inquiry.fullName} — ${eventType}`,
    html,
  });
}

export async function sendFeedbackNotification(feedback: {
  name: string;
  email: string;
  company?: string | null;
  rating: number;
  comment: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const to = await getRecipients("feedback");

  const stars = "★".repeat(feedback.rating) + "☆".repeat(5 - feedback.rating);

  const html = emailWrapper(`
    <h1 style="color:#9e1115;font-size:24px;font-weight:700;margin:0 0 8px;">New Feedback Received</h1>
    <p style="color:#888;font-size:14px;margin:0 0 32px;">A new feedback submission has been received from the website.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
      ${fieldRow("Name", feedback.name)}
      ${feedback.company ? fieldRow("Company", feedback.company) : ""}
      ${fieldRow("Email", `<a href="mailto:${feedback.email}" style="color:#9e1115;text-decoration:none;">${feedback.email}</a>`)}
      <tr>
        <td style="padding:10px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;width:130px;border-bottom:1px solid #f0f0f0;">Rating</td>
        <td style="padding:10px 0;font-size:20px;letter-spacing:3px;border-bottom:1px solid #f0f0f0;">${stars}</td>
      </tr>
    </table>

    <div style="background-color:#f8f8f8;border-left:4px solid #9e1115;padding:20px 24px;margin-bottom:32px;">
      <p style="color:#171717;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin:0 0 8px;">Comment</p>
      <p style="color:#555;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${feedback.comment}</p>
    </div>

    <table cellpadding="0" cellspacing="0">
      <tr>
        <td style="background-color:#9e1115;border-radius:0;">
          <a href="${SITE_URL}/admin/feedback" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">VIEW IN DASHBOARD &rarr;</a>
        </td>
      </tr>
    </table>
  `);

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `New Feedback from ${feedback.name} — ${feedback.rating}★`,
    html,
  });
}
