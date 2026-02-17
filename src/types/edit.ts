export interface Edit {
    id: number;
    client_id: number;
    editor_id: number;

    script_id?: number;
    shoot_id?: number;

    video_title: string;
    render_link?: string;

    status: 'In Progress' | 'Review' | 'Revision Needed' | 'Completed';

    created_at: string;
    delivered_at?: string;
    finalized_at?: string;
}

export interface EditRevision {
    id: number;
    edit_id: number;
    revision_number: number;
    feedback_text?: string;
    requested_by?: number;

    created_at: string;
    resolved_at?: string;
}
