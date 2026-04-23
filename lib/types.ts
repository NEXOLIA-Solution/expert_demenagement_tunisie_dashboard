export interface Appointment {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  date: string
  time: string
  addressFrom: string
  addressTo: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  notes: string
}

export interface Transaction {
  id: string
  date: string
  type: "revenue" | "charge"
  category: string
  amount: number
  description: string
  project?: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  date: string
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue"
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  unit: string
  location: string
  lastUpdated: string
}

export interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  date: string
}

export interface Review {
  id: string
  clientName: string
  clientEmail: string
  rating: number
  comment: string
  date: string
  status: "pending" | "approved" | "rejected"
}

export interface NewsItem {
  id: string
  title: string
  content: string
  type: "news" | "promotion"
  discount?: string
  validUntil?: string
  publishDate: string
  isActive: boolean
}
