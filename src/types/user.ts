export interface User {
    id: number;
    name: string;
    role: 'Content Creator' | 'Reel Maker' | 'Editor' | 'Manager' | 'Specialist' | 'Admin';
    email?: string;
    username?: string;
    password?: string;
    active: number; // 1 for active, 0 for inactive
    rate_per_month?: number;
    created_at: string;
}
