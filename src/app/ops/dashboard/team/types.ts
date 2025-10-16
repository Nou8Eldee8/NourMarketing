export interface TeamMember {
  id: number;
  name: string;
  role:
    | "content_creator"
    | "reel_maker"
    | "video_editor"
    | "social_media_specialist"
    | "team_leader";
}

export interface TaskLog {
  id: number;
  memberId: number;
  memberName: string;
  role: string;
  action: string; // e.g., "uploaded 2 videos"
  client?: string;
  timestamp: string;
}

export interface TaskSummary {
  role: string;
  totalAssigned: number;
  totalCompleted: number;
}
