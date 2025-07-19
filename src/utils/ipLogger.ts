// src/utils/ipLogger.ts

const SUPABASE_URL = "https://xjwebiyseiesgmvvblba.supabase.co";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhqd2ViaXlzZWllc2dtdnZibGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODY4MjIsImV4cCI6MjA2Njk2MjgyMn0.VU3jb4kdJEUwjXidK4d7m7eZQSU2s7oz2EsQcBf91Dk";
const TABLE_NAME = "visitor_logs";

// Helper to get IP address
async function getIpAddress(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch {
    return "unknown";
  }
}

// Main logger
export async function logVisitorEvent(eventKey: string) {
  // Only log once per session per eventKey
  if (sessionStorage.getItem(`logged_${eventKey}`)) return;
  sessionStorage.setItem(`logged_${eventKey}`, "1");

  const [ip, userAgent, pageUrl, timestamp] = [
    await getIpAddress(),
    navigator.userAgent,
    window.location.href,
    new Date().toISOString(),
  ];

  // Supabase REST API insert
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_API_KEY,
      "Authorization": `Bearer ${SUPABASE_API_KEY}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify([{ ip_address: ip, user_agent: userAgent, page_url: pageUrl, timestamp }])
  });

  if (!res.ok) {
    // If table does not exist, log error and show comment for manual creation
    // eslint-disable-next-line no-console
    console.error(
      `Failed to log visitor event. If the 'visitor_logs' table does not exist, create it in Supabase with:\n\n` +
      `-- Run this in the Supabase SQL editor if the table does not exist:\n` +
      `create table if not exists visitor_logs (\n` +
      `  id uuid primary key default gen_random_uuid(),\n` +
      `  ip_address text,\n` +
      `  user_agent text,\n` +
      `  page_url text,\n` +
      `  timestamp timestamptz default now()\n` +
      `);`
    );
  }
} 