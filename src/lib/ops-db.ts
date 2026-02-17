// Database helper for OPS_DB (Cloudflare D1)
export async function getOpsDB() {
    // In Next.js API routes running on Cloudflare, we access D1 via env bindings
    const { OPS_DB } = (globalThis as any).env ?? {};
    if (!OPS_DB) {
        throw new Error("OPS_DB not available. Ensure you're running on Cloudflare with D1 bindings.");
    }
    return OPS_DB;
}

// Helper to execute queries with error handling
export async function executeQuery<T = any>(
    query: string,
    params: any[] = []
): Promise<T[]> {
    const db = await getOpsDB();
    try {
        const result = await db.prepare(query).bind(...params).all();
        return result.results as T[];
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

// Helper to execute a single row query
export async function executeQueryOne<T = any>(
    query: string,
    params: any[] = []
): Promise<T | null> {
    const db = await getOpsDB();
    try {
        const result = await db.prepare(query).bind(...params).first();
        return result as T | null;
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}

// Helper to execute insert/update/delete
export async function executeUpdate(
    query: string,
    params: any[] = []
): Promise<{ success: boolean; meta?: any }> {
    const db = await getOpsDB();
    try {
        const result = await db.prepare(query).bind(...params).run();
        return { success: result.success, meta: result.meta };
    } catch (error) {
        console.error("Database update error:", error);
        throw error;
    }
}
