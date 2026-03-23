export interface Post {
  id: string
  title: string
  content: string | null
  excerpt: string | null
  type: string
  status: string | null
  published: boolean | null
  slug: string | null
  image_url: string | null
  add_to_calendar: boolean | null
  calendar_date: Date | null
  calendar_end_date: Date | null
  competition_status: string | null
  competition_start_date: Date | null
  competition_end_date: Date | null
  group_category: string | null
  user_id: string | null
  published_at: Date | null
  created_at: Date
  updated_at: Date | null
  images?: string[] | null
}

export interface Group {
  id: string
  name: string
  slug: string
  password: string | null
  teacher_name: string | null
  teacher_photo: string | null
  meal_plan_url: string | null
  age_group: string | null
  hours: string | null
  number_of_children: string | null
  description: string | null
  schedule: any | null
  documents: any | null
  contact_hours: string | null
  color: string | null
  email: string | null
  phone: string | null
  created_at: Date
  updated_at: Date | null
}

export interface Gallery {
  id: string
  title: string
  description: string | null
  category: string | null
  cover_image_url: string | null
  status: string | null
  slug: string
  created_at: Date
  updated_at: Date | null
  created_by: string | null
}

export interface GalleryImage {
  id: string
  gallery_id: string | null
  image_url: string
  title: string | null
  sort_order: number | null
  created_at: Date
}

export interface MealPlan {
  id: string
  week_start: Date
  week_end: Date
  pdf_url: string | null
  image_url: string | null
  uploaded_by: string | null
  created_at: Date
  is_current?: boolean | null
}

export interface Media {
  id: string
  file_url: string
  file_name: string
  file_type: string
  file_size: string | null
  category: string | null
  subcategory: string | null
  uploaded_by: string | null
  created_at: Date
}

export interface User {
  id: string
  email: string
  password: string
  role: string
  name: string | null
  created_at: Date
}
