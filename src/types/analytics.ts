export interface DailyAnalytics {
    id: number;
    date: string;
    client_id: number;

    // Daily Activity Counts
    scripts_created: number;
    shoots_completed: number;
    edits_completed: number;
    posts_published: number;

    // Rolling 30-Day Metrics
    delivery_rate_30d: number;
}
