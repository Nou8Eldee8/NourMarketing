export interface Shoot {
    id: number;
    client_id: number;
    reel_maker_id: number;

    shoot_date: string;
    location?: string;

    num_videos_filmed: number;
    raw_footage_link?: string;

    status: 'Scheduled' | 'Completed' | 'Canceled';

    created_at: string;
    completed_at?: string;
}
