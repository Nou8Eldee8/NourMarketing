import { NextRequest, NextResponse } from "next/server";
import { executeQuery, executeUpdate } from "@/lib/ops-db";

interface TeamMember {
    id: number;
    name: string;
    role: string;
    email?: string;
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: clientId } = await params;

        // Fetch creators
        const creators = await executeQuery<TeamMember>(
            `SELECT u.id, u.name, u.role, u.email 
       FROM users u 
       INNER JOIN client_creators cc ON u.id = cc.creator_id 
       WHERE cc.client_id = ?`,
            [clientId]
        );

        // Fetch specialists
        const specialists = await executeQuery<TeamMember>(
            `SELECT u.id, u.name, u.role, u.email 
       FROM users u 
       INNER JOIN client_specialists cs ON u.id = cs.specialist_id 
       WHERE cs.client_id = ?`,
            [clientId]
        );

        // Fetch editors
        const editors = await executeQuery<TeamMember>(
            `SELECT u.id, u.name, u.role, u.email 
       FROM users u 
       INNER JOIN client_editors ce ON u.id = ce.editor_id 
       WHERE ce.client_id = ?`,
            [clientId]
        );

        return NextResponse.json({
            success: true,
            data: {
                creators,
                specialists,
                editors,
            },
        });
    } catch (error: any) {
        console.error("GET /api/ops/clients/[id]/team error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: clientId } = await params;
        const body: any = await req.json();
        const { creator_ids = [], specialist_ids = [], editor_ids = [] } = body;

        // Remove existing assignments
        await executeUpdate(
            "DELETE FROM client_creators WHERE client_id = ?",
            [clientId]
        );
        await executeUpdate(
            "DELETE FROM client_specialists WHERE client_id = ?",
            [clientId]
        );
        await executeUpdate(
            "DELETE FROM client_editors WHERE client_id = ?",
            [clientId]
        );

        // Add new creator assignments
        for (const creatorId of creator_ids) {
            await executeUpdate(
                "INSERT INTO client_creators (client_id, creator_id) VALUES (?, ?)",
                [clientId, creatorId]
            );
        }

        // Add new specialist assignments
        for (const specialistId of specialist_ids) {
            await executeUpdate(
                "INSERT INTO client_specialists (client_id, specialist_id) VALUES (?, ?)",
                [clientId, specialistId]
            );
        }

        // Add new editor assignments
        for (const editorId of editor_ids) {
            await executeUpdate(
                "INSERT INTO client_editors (client_id, editor_id) VALUES (?, ?)",
                [clientId, editorId]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("PUT /api/ops/clients/[id]/team error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
