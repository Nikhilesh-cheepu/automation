import { NextResponse } from "next/server";
import { getClientsFromDb } from "@/lib/clients-db";
import { ensureDb } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureDb();
  const clients = await getClientsFromDb();
  return NextResponse.json(clients);
}

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Clients are defined in src/config/clients.ts. Run npm run db:sync after editing.",
    },
    { status: 403 }
  );
}
