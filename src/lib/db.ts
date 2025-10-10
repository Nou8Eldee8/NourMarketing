export async function getDB() {
  const { DB } = (globalThis as any).env ?? {};
  if (!DB) throw new Error("D1 database not initialized in this environment");
  return DB;
}
