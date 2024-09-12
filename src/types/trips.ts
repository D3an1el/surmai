export type Trip = {
  id: string,
  name: string,
  description?: string,
  startDate: Date | string,
  endDate: Date | string,
  coverImage?: string
  participants?: string[]
  destinations?: string[]
}

export type CreateTripForm = {
  name: string,
  description?: string,
  dateRange: [Date | null, Date | null],
  coverImage?: string
  participants?: string[]
  destinations?: string[]
}

export type Transportation = {
  id: string,
  type: string,
  origin: string,
  destination: string,
  cost: {
    value: number,
    currency: string
  },
  departureTime: Date,
  arrivalTime: Date,
  trip: string,
  metadata: { [key: string]: any }
  attachments: string[]
}