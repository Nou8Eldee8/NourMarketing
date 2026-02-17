import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { DailyAnalytics } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const client_id = searchParams.get("client_id");
        const start_date = searchParams.get("start_date");
        const end_date = searchParams.get("end_date");

        let query = "SELECT * FROM daily_analytics WHERE 1=1";
        const params: any[] = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }
        if (start_date) {
            query += " AND date >= ?";
            params.push(start_date);
        }
        if (end_date) {
            query += " AND date <= ?";
            params.push(end_date);
        }

        query += " ORDER BY date DESC";

        const analytics = await executeQuery<DailyAnalytics>(query, params);
        return NextResponse.json({ success: true, data: analytics });
    } catch (error: any) {
        console.error("GET /api/ops/analytics error:", error);
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
            date,
            client_id,
            scripts_created,
            shoots_completed,
            edits_completed,
            posts_published,
            delivery_rate_30d,
        } = body;

        if (!client_id) {
            return NextResponse.json(
                { success: false, error: "client_id is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO daily_analytics (
        date, client_id, scripts_created, shoots_completed, edits_completed,
        posts_published, delivery_rate_30d
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                date || new Date().toISOString().split("T")[0],
                client_id,
                scripts_created || 0,
                shoots_completed || 0,
                edits_completed || 0,
                posts_published || 0,
                delivery_rate_30d || 0,
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/analytics error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const {
            id,
            scripts_created,
            shoots_completed,
            edits_completed,
            posts_published,
            delivery_rate_30d,
        } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Analytics ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE daily_analytics SET
        scripts_created = ?, shoots_completed = ?, edits_completed = ?,
        posts_published = ?, delivery_rate_30d = ?
       WHERE id = ?`,
            [scripts_created, shoots_completed, edits_completed, posts_published, delivery_rate_30d, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/analytics error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
