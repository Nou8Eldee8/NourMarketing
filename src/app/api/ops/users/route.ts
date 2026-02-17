import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeQueryOne, executeUpdate } from "@/lib/ops-db";
import { User } from "@/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            // Get single user
            const user = await executeQueryOne<User>(
                "SELECT * FROM users WHERE id = ?",
                [id]
            );
            return NextResponse.json({ success: true, data: user });
        }

        // Get all users
        const users = await executeQuery<User>("SELECT * FROM users ORDER BY name");
        return NextResponse.json({ success: true, data: users });
    } catch (error: any) {
        console.error("GET /api/ops/users error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { name, role, email, rate_per_item } = body;

        if (!name || !role) {
            return NextResponse.json(
                { success: false, error: "Name and role are required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `INSERT INTO users (name, role, email, rate_per_item) 
       VALUES (?, ?, ?, ?)`,
            [name, role, email || null, rate_per_item || null]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("POST /api/ops/users error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body: any = await req.json();
        const { id, name, role, email, active, rate_per_item } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "User ID is required" },
                { status: 400 }
            );
        }

        const result = await executeUpdate(
            `UPDATE users 
       SET name = ?, role = ?, email = ?, active = ?, rate_per_item = ?
       WHERE id = ?`,
            [name, role, email, active ?? 1, rate_per_item, id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("PUT /api/ops/users error:", error);
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
                { success: false, error: "User ID is required" },
                { status: 400 }
            );
        }

        // Soft delete by setting active = 0
        const result = await executeUpdate(
            "UPDATE users SET active = 0 WHERE id = ?",
            [id]
        );

        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        console.error("DELETE /api/ops/users error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
