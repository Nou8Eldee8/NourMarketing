import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

interface NoteBody {
  lead_id: string;
  user_id: number;
  note: string;
}

interface EditBody {
  id: number;
  note: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lead_id = searchParams.get("lead_id");

  if (!lead_id) {
    return NextResponse.json({ error: "Missing lead_id" }, { status: 400 });
  }

  const db = await getDB();

  const { results } = await db
    .prepare(`SELECT * FROM lead_notes WHERE lead_id = ? ORDER BY created_at DESC`)
    .bind(lead_id)
    .all();

  return NextResponse.json(results);
}

export async function POST(request: Request) {
  const body = (await request.json()) as NoteBody;
  const { lead_id, user_id, note } = body;

  if (!lead_id || !user_id || !note) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const db = await getDB();

  await db
    .prepare(`INSERT INTO lead_notes (lead_id, user_id, note) VALUES (?, ?, ?)`)
    .bind(lead_id, user_id, note)
    .run();

  return NextResponse.json({ success: true });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as EditBody;
  const { id, note } = body;

  if (!id || !note) {
    return NextResponse.json({ error: "Missing id or note" }, { status: 400 });
  }

  const db = await getDB();

  await db
    .prepare(
      `UPDATE lead_notes SET note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    )
    .bind(note, id)
    .run();

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const db = await getDB();

  await db.prepare(`DELETE FROM lead_notes WHERE id = ?`).bind(id).run();

  return NextResponse.json({ success: true });
}
