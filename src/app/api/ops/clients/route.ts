import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { Client } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const status = searchParams.get("status");

        if (id) {
            // Get single client
            const client = await executeQueryOne<Client>(
                "SELECT * FROM clients WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: client });
        }

        // Get all clients, optionally filter by status
        let query = "SELECT * FROM clients";
        const params: any[] = [];

        if (status) {
            query += " WHERE status = ?";
            params.push(status);
        }

        query += " ORDER BY name";

        const clients = await executeQuery<Client>(query, params);
        return NextResponse.json({ success: true, data: clients });
    } catch (error: any) {
        console.error("GET /api/ops/clients error:", error);
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
            name,
            industry,
            status,
            start_date,
            contract_end_date,
            videos_per_month,
            posts_per_month,
            budget,
            currency,
            notes,
        } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: "Client name is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO clients (
        name, industry, status, start_date, contract_end_date,
        videos_per_month, posts_per_month, budget, currency, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                industry || null,
                status || "Active",
                start_date || null,
                contract_end_date || null,
                videos_per_month || 0,
                posts_per_month || 0,
                budget || 0,
                currency || "USD",
                notes || null,
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/clients error:", error);
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
            name,
            industry,
            status,
            start_date,
            contract_end_date,
            videos_per_month,
            posts_per_month,
            budget,
            currency,
            notes,
            leave_reason,
        } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Client ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE clients SET
        name = ?, industry = ?, status = ?, start_date = ?, contract_end_date = ?,
        videos_per_month = ?, posts_per_month = ?, budget = ?, currency = ?,
        notes = ?, leave_reason = ?
       WHERE id = ?`,
            [
                name,
                industry,
                status,
                start_date,
                contract_end_date,
                videos_per_month,
                posts_per_month,
                budget,
                currency,
                notes,
                leave_reason,
                id,
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/clients error:", error);
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
                { success: false, error: "Client ID is required" },
                { status: 400 }
            );
        }

        // Mark as churned instead of deleting
        const result = await executeUpdate(
            "UPDATE clients SET status = 'Churned' WHERE id = ?",
            [id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/clients error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
