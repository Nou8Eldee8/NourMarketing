import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { Edit } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const client_id = searchParams.get("client_id");
        const editor_id = searchParams.get("editor_id");
        const status = searchParams.get("status");

        if (id) {
            const edit = await executeQueryOne<Edit>(
                "SELECT * FROM edits WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: edit });
        }

        let query = "SELECT * FROM edits WHERE 1=1";
        const params: any[] = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }
        if (editor_id) {
            query += " AND editor_id = ?";
            params.push(editor_id);
        }
        if (status) {
            query += " AND status = ?";
            params.push(status);
        }

        query += " ORDER BY created_at DESC";

        const edits = await executeQuery<Edit>(query, params);
        return NextResponse.json({ success: true, data: edits });
    } catch (error: any) {
        console.error("GET /api/ops/edits error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: any = await req.json();
        const {
            client_id,
            editor_id,
            script_id,
            shoot_id,
            video_title,
            render_link,
            status,
        } = body;

        if (!client_id || !editor_id || !video_title) {
            return NextResponse.json(
                { success: false, error: "client_id, editor_id, and video_title are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO edits (client_id, editor_id, script_id, shoot_id, video_title, render_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                client_id,
                editor_id,
                script_id || null,
                shoot_id || null,
                video_title,
                render_link || null,
                status || "In Progress",
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/edits error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { id, video_title, render_link, status, delivered_at } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Edit ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE edits SET video_title = ?, render_link = ?, status = ?, delivered_at = ?
       WHERE id = ?`,
            [video_title, render_link, status, delivered_at, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/edits error:", error);
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
                { success: false, error: "Edit ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate("DELETE FROM edits WHERE id = ?", [id]);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/edits error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
