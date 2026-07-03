import { redirect } from "next/navigation";

/**
 * Legacy /services route — redirects to the Event Services landing page.
 * All service content now lives under /services/events and /services/tech.
 */
export default function ServicesRedirectPage() {
  redirect("/services/events");
}
