export interface Publish {
    id: number;
    client_id: number;
    specialist_id?: number;

    edit_id?: number;
    script_id?: number;

    platform: 'Instagram' | 'Facebook' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Other';
    content_type: 'Reel' | 'Post' | 'Story' | 'Carousel';

    post_link?: string;

    // Performance Metrics
    views: number;
    likes: number;
    comments: number;
    shares: number;

    published_at: string;
}
