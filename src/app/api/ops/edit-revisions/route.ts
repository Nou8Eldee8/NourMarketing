import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeUpdate } from "@/lib/ops-db";
import { EditRevision } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const edit_id = searchParams.get("edit_id");

        if (!edit_id) {
            return NextResponse.json(
                { success: false, error: "edit_id is required" },
                { status: 400 }
            );
        }

        const revisions = await executeQuery<EditRevision>(
            "SELECT * FROM edit_revisions WHERE edit_id = ? ORDER BY revision_number",
            [edit_id]
        );

        return NextResponse.json({ success: true, data: revisions });
    } catch (error: any) {
        console.error("GET /api/ops/edit-revisions error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { edit_id, revision_number, feedback_text, requested_by } = body;

        if (!edit_id || !revision_number) {
            return NextResponse.json(
                { success: false, error: "edit_id and revision_number are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO edit_revisions (edit_id, revision_number, feedback_text, requested_by)
       VALUES (?, ?, ?, ?)`,
            [edit_id, revision_number, feedback_text || null, requested_by || null]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/edit-revisions error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { id, resolved_at } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Revision ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            "UPDATE edit_revisions SET resolved_at = ? WHERE id = ?",
            [resolved_at || new Date().toISOString(), id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/edit-revisions error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
