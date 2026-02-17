import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { Shoot } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const client_id = searchParams.get("client_id");
        const reel_maker_id = searchParams.get("reel_maker_id");
        const status = searchParams.get("status");

        if (id) {
            const shoot = await executeQueryOne<Shoot>(
                "SELECT * FROM shoots WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: shoot });
        }

        let query = "SELECT * FROM shoots WHERE 1=1";
        const params: any[] = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }
        if (reel_maker_id) {
            query += " AND reel_maker_id = ?";
            params.push(reel_maker_id);
        }
        if (status) {
            query += " AND status = ?";
            params.push(status);
        }

        query += " ORDER BY shoot_date DESC";

        const shoots = await executeQuery<Shoot>(query, params);
        return NextResponse.json({ success: true, data: shoots });
    } catch (error: any) {
        console.error("GET /api/ops/shoots error:", error);
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
            reel_maker_id,
            shoot_date,
            location,
            num_videos_filmed,
            raw_footage_link,
            status,
        } = body;

        if (!client_id || !reel_maker_id || !shoot_date) {
            return NextResponse.json(
                { success: false, error: "client_id, reel_maker_id, and shoot_date are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO shoots (client_id, reel_maker_id, shoot_date, location, num_videos_filmed, raw_footage_link, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                client_id,
                reel_maker_id,
                shoot_date,
                location || null,
                num_videos_filmed || 0,
                raw_footage_link || null,
                status || "Scheduled",
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/shoots error:", error);
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
            shoot_date,
            location,
            num_videos_filmed,
            raw_footage_link,
            status,
        } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Shoot ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE shoots SET shoot_date = ?, location = ?, num_videos_filmed = ?, raw_footage_link = ?, status = ?
       WHERE id = ?`,
            [shoot_date, location, num_videos_filmed, raw_footage_link, status, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/shoots error:", error);
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
                { success: false, error: "Shoot ID is required" },
                { status: 400 }
            );
        }

        // Mark as canceled
        const result = await executeUpdate(
            "UPDATE shoots SET status = 'Canceled' WHERE id = ?",
            [id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/shoots error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
