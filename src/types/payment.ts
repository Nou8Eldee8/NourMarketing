export interface Payment {
    id: number;
    client_id: number;

    amount: number;
    currency: string;

    due_date?: string;
    paid_date?: string;

    status: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
    invoice_url?: string;

    created_at: string;
}
