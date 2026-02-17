import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { Publish } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const client_id = searchParams.get("client_id");
        const platform = searchParams.get("platform");
        const content_type = searchParams.get("content_type");

        if (id) {
            const publish = await executeQueryOne<Publish>(
                "SELECT * FROM publishes WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: publish });
        }

        let query = "SELECT * FROM publishes WHERE 1=1";
        const params: any[] = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }
        if (platform) {
            query += " AND platform = ?";
            params.push(platform);
        }
        if (content_type) {
            query += " AND content_type = ?";
            params.push(content_type);
        }

        query += " ORDER BY published_at DESC";

        const publishes = await executeQuery<Publish>(query, params);
        return NextResponse.json({ success: true, data: publishes });
    } catch (error: any) {
        console.error("GET /api/ops/publishes error:", error);
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
            specialist_id,
            edit_id,
            script_id,
            platform,
            content_type,
            post_link,
            views,
            likes,
            comments,
            shares,
        } = body;

        if (!client_id || !platform || !content_type) {
            return NextResponse.json(
                { success: false, error: "client_id, platform, and content_type are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO publishes (
        client_id, specialist_id, edit_id, script_id, platform, content_type,
        post_link, views, likes, comments, shares
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                client_id,
                specialist_id || null,
                edit_id || null,
                script_id || null,
                platform,
                content_type,
                post_link || null,
                views || 0,
                likes || 0,
                comments || 0,
                shares || 0,
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/publishes error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { id, post_link, views, likes, comments, shares } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Publish ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE publishes SET post_link = ?, views = ?, likes = ?, comments = ?, shares = ?
       WHERE id = ?`,
            [post_link, views, likes, comments, shares, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/publishes error:", error);
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
                { success: false, error: "Publish ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate("DELETE FROM publishes WHERE id = ?", [id]);

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/publishes error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
