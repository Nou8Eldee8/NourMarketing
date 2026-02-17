import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { Payment } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const client_id = searchParams.get("client_id");
        const status = searchParams.get("status");

        if (id) {
            const payment = await executeQueryOne<Payment>(
                "SELECT * FROM payments WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: payment });
        }

        let query = "SELECT * FROM payments WHERE 1=1";
        const params: any[] = [];

        if (client_id) {
            query += " AND client_id = ?";
            params.push(client_id);
        }
        if (status) {
            query += " AND status = ?";
            params.push(status);
        }

        query += " ORDER BY due_date DESC";

        const payments = await executeQuery<Payment>(query, params);
        return NextResponse.json({ success: true, data: payments });
    } catch (error: any) {
        console.error("GET /api/ops/payments error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { client_id, amount, currency, due_date, status, invoice_url } = body;

        if (!client_id || !amount) {
            return NextResponse.json(
                { success: false, error: "client_id and amount are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO payments (client_id, amount, currency, due_date, status, invoice_url)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [
                client_id,
                amount,
                currency || "USD",
                due_date || null,
                status || "Pending",
                invoice_url || null,
            ]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/payments error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { id, amount, currency, due_date, paid_date, status, invoice_url } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Payment ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE payments SET amount = ?, currency = ?, due_date = ?, paid_date = ?, status = ?, invoice_url = ?
       WHERE id = ?`,
            [amount, currency, due_date, paid_date, status, invoice_url, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/payments error:", error);
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
                { success: false, error: "Payment ID is required" },
                { status: 400 }
            );
        }

        // Mark as cancelled
        const result = await executeUpdate(
            "UPDATE payments SET status = 'Cancelled' WHERE id = ?",
            [id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/payments error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
