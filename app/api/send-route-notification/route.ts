import type { DocumentProps } from "@react-pdf/renderer";
import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { RoutePDF } from "./RoutePDF";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type NotificationUser = {
  id: string;
  email: string;
  name: string;
};

type RouteNotificationBody = {
  registeredUsers: NotificationUser[];
  unregisteredUsers: NotificationUser[];
  groupLeader: NotificationUser | null;
  route: {
    route_label: string;
    volunteer_type: string;
    maps_link: string | null;
  };
  session: {
    watering_event_name: string;
    date: string;
    central_hub: string;
  };
  stops: {
    order_to_visit: number;
    property_address: string;
  }[];
};

async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
  attachment,
}: {
  to: string;
  subject: string;
  htmlContent: string;
  attachment?: { content: string; name: string };
}) {
  const body = {
    sender: {
      name: process.env.BREVO_SENDER_NAME,
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: to }],
    subject,
    htmlContent,
    ...(attachment ? { attachment: [attachment] } : {}),
  };

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error sending to ${to}: ${err}`);
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !fromEmail) {
    return NextResponse.json(
      { error: "Email service not configured" },
      { status: 500 },
    );
  }

  let data: RouteNotificationBody;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const {
    registeredUsers,
    unregisteredUsers,
    groupLeader,
    route,
    session,
    stops,
  } = data;
  const errors: string[] = [];

  for (const user of registeredUsers) {
    try {
      await sendBrevoEmail({
        to: user.email,
        subject: `You've been assigned to a route — ${session.watering_event_name}`,
        htmlContent: `
          <p>Hi ${user.name},</p>
          <p>You've been assigned to <strong>${route.route_label}</strong> for
          <strong>${session.watering_event_name}</strong> on ${session.date}.</p>
          <p>Log in to the app to view your full route details.</p>
          <p>Thank you,<br/>Amigos de los Rios</p>
        `,
      });
    } catch (err) {
      errors.push(`Failed to notify ${user.email}: ${err}`);
    }
  }

  if (unregisteredUsers.length > 0) {
    let pdfBase64: string;
    try {
      const routePdfProps: React.ComponentProps<typeof RoutePDF> = {
        session,
        route,
        groupLeader,
        stops,
      };
      const pdfBuffer = await renderToBuffer(
        React.createElement(
          RoutePDF as React.ComponentType<
            React.ComponentProps<typeof RoutePDF>
          >,
          routePdfProps,
        ) as React.ReactElement<DocumentProps>,
      );
      pdfBase64 = pdfBuffer.toString("base64");
    } catch (err) {
      return NextResponse.json(
        { error: `Failed to generate PDF: ${err}` },
        { status: 500 },
      );
    }

    const pdfName =
      `${session.watering_event_name}-${route.route_label}.pdf`.replace(
        /[^a-zA-Z0-9._-]/g,
        "-",
      );

    for (const user of unregisteredUsers) {
      try {
        await sendBrevoEmail({
          to: user.email,
          subject: `Your volunteer route — ${session.watering_event_name}`,
          htmlContent: `
            <p>Hi ${user.name},</p>
            <p>You've been assigned as a volunteer for
            <strong>${session.watering_event_name}</strong> on ${session.date}.</p>
            <p>Your route details are in the attached PDF. Your central hub is
            <strong>${session.central_hub}</strong>.</p>
            <p>Thank you,<br/>Amigos de los Rios</p>
          `,
          attachment: { content: pdfBase64, name: pdfName },
        });
      } catch (err) {
        errors.push(`Failed to notify ${user.email}: ${err}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error("Some notification emails failed:", errors);
    return NextResponse.json({ success: false, errors }, { status: 207 });
  }

  return NextResponse.json({ success: true });
}
