export interface TechStackItem {
    id: number;
    name: string;
    slug: string;
}

export interface Job {
    id: number;
    tech_stack: TechStackItem[];
    title: string;
    description: string;
    is_active: boolean;
    posted_at: string;
    created_by: number;
}