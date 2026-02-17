import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { Script } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const client_id = searchParams.get("client_id");
        const creator_id = searchParams.get("creator_id");
        const status = searchParams.get("status");

        if (id) {
            const script = await executeQueryOne<Script>(
                "SELECT * FROM scripts WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: script });
        }

        let query = "SELECT * FROM scripts WHERE 1=1";
        const params: any[] = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }
        if (creator_id) {
            query += " AND creator_id = ?";
            params.push(creator_id);
        }
        if (status) {
            query += " AND status = ?";
            params.push(status);
        }

        query += " ORDER BY created_at DESC";

        const scripts = await executeQuery<Script>(query, params);
        return NextResponse.json({ success: true, data: scripts });
    } catch (error: any) {
        console.error("GET /api/ops/scripts error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { client_id, creator_id, title, type, script_text, status } = body;

        if (!client_id || !creator_id || !title) {
            return NextResponse.json(
                { success: false, error: "client_id, creator_id, and title are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO scripts (client_id, creator_id, title, type, script_text, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [client_id, creator_id, title, type || "Video", script_text || null, status || "Draft"]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/scripts error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { id, title, type, script_text, status } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Script ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE scripts SET title = ?, type = ?, script_text = ?, status = ?
       WHERE id = ?`,
            [title, type, script_text, status, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/scripts error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Script ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate("DELETE FROM scripts WHERE id = ?", [id]);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/scripts error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
