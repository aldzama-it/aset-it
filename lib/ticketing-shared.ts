export const TICKET_STATUSES = ['NEW', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED'] as const
export const TICKET_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'] as const

export type TicketStatus = (typeof TICKET_STATUSES)[number]
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export type TicketingQuery = {
  dateFrom: string
  dateTo: string
  status: TicketStatus | null
  priority: TicketPriority | null
  page: number
}

export type TicketingDashboard = {
  filters: {
    date_from: string
    date_to: string
    status: TicketStatus | null
    priority: TicketPriority | null
  }
  summary: {
    total_tickets: number
    active_tickets: number
    completed_tickets: number
    urgent_tickets: number
  }
  status_breakdown: { status: TicketStatus; total: number }[]
  trend: { date: string; created: number; completed: number }[]
  tickets: {
    data: TicketingTicket[]
    pagination: {
      current_page: number
      last_page: number
      per_page: number
      total: number
    }
  }
}

export type TicketingTicket = {
  id: number
  ticket_number: string
  subject: string
  reporter_name: string
  category: string | null
  department: string | null
  location: string | null
  priority: TicketPriority
  status: TicketStatus
  assigned_to: string | null
  created_at: string | null
  resolved_at: string | null
  detail_url: string
}
