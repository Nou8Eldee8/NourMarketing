export interface Script {
    id: number;
    client_id: number;
    creator_id: number;

    title: string;
    type: 'Video' | 'Post';
    script_text?: string;

    status: 'Draft' | 'Approved' | 'Rejected' | 'Used';

    created_at: string;
    approved_at?: string;
}
