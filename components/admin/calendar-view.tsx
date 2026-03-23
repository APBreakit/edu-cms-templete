"use client"

import { useState, useMemo } from "react"
import { Calendar, ArrowUpRight, Megaphone, Trophy, ChevronLeft, ChevronRight, Users, Eye } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

type EventType = "aktualnosci" | "ogloszenia" | "konkursy" | "rada-rodzicow" | "okiem-specjalisty"

interface CalendarEvent {
  date: number
  type: EventType
  title: string
  endDate?: number
  articleId?: string
  slug?: string
  daysUntil?: number
}

interface EventData {
  id: string
  title: string
  type: string
  calendar_date: string
  calendar_end_date: string | null
  add_to_calendar: boolean
  status: string
  slug: string
  competition_status?: string
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function getDaysUntil(targetDate: number, currentDate: number) {
  return targetDate - currentDate
}

export default function CalendarView({ events }: { events: any[] }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentDay] = useState(new Date().getDate())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ]

  const dayNames = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"]

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return events
      .filter((event) => event.add_to_calendar && (event.calendar_date || event.calendar_end_date) && event.status === "published")
      .map((event) => {
        const dateStr = event.calendar_date || event.calendar_end_date
        if (!dateStr) return null

        const date = new Date(dateStr)
        const endDate = event.calendar_end_date ? new Date(event.calendar_end_date) : undefined

        if (date.getMonth() === month && date.getFullYear() === year) {
          let daysUntil = undefined
          if (event.type === "konkursy" && endDate) {
            const now = new Date()
            now.setHours(0, 0, 0, 0)
            daysUntil = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          }

          let eventType: EventType = "aktualnosci"
          if (event.type === "ogloszenia" || event.type === "ogloszenie") eventType = "ogloszenia"
          else if (event.type === "konkursy" || event.type === "konkurs") eventType = "konkursy"
          else if (event.type === "rada-rodzicow") eventType = "rada-rodzicow"
          else if (event.type === "okiem-specjalisty") eventType = "okiem-specjalisty"

          return {
            date: date.getDate(),
            type: eventType,
            title: event.title,
            endDate: endDate?.getDate(),
            articleId: event.id,
            slug: event.slug,
            daysUntil: daysUntil,
          }
        }
        return null
      })
      .filter(Boolean) as CalendarEvent[]
  }, [events, month, year])

  // Generate calendar days
  const calendarDays = []
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const getEventsForDay = (day: number | null) => {
    if (!day) return []
    return calendarEvents.filter((event) => event.date === day)
  }

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case "aktualnosci":
        return <Calendar className="w-3 h-3" />
      case "ogloszenia":
        return <Megaphone className="w-3 h-3" />
      case "konkursy":
        return <Trophy className="w-3 h-3" />
      case "rada-rodzicow":
        return <Users className="w-3 h-3" />
      case "okiem-specjalisty":
        return <Eye className="w-3 h-3" />
    }
  }

  const isUrgent = (event: CalendarEvent) => {
    if (!event.endDate) return false
    const daysUntil = getDaysUntil(event.endDate, currentDay)
    return daysUntil <= 3 && daysUntil >= 0
  }

  return (
    <div className="space-y-6 flex flex-col w-full">
      <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <h2 className="font-semibold text-xl sm:text-2xl text-gray-900">
            {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
            >
              Dziś
            </button>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1))}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="grid grid-cols-7 gap-1 bg-gray-50 p-2 rounded-xl min-w-[600px] md:min-w-0">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day)
              const hasUrgentEvent = dayEvents.some(isUrgent)

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 rounded-lg transition-all ${day
                    ? `bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md ${hasUrgentEvent ? "animate-pulse" : ""
                    }`
                    : "bg-transparent"
                    }`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-semibold mb-1 ${day === new Date().getDate() &&
                          month === new Date().getMonth() &&
                          year === new Date().getFullYear()
                          ? "text-blue-600"
                          : "text-gray-700"
                          }`}
                      >
                        {day}
                      </div>

                      <div className="space-y-1.5 sm:space-y-1">
                        {dayEvents.map((event, eventIndex) => {
                          const urgent = isUrgent(event)
                          const daysUntil = event.endDate ? getDaysUntil(event.endDate, currentDay) : null
                          const eventLink = isAdmin ? `/admin/posts/${event.articleId}` : `/${event.type}/${event.slug || event.articleId}`

                          return (
                            <Link
                              href={eventLink}
                              key={eventIndex}
                              className={`flex items-center gap-1.5 sm:gap-1 text-xs p-1.5 sm:p-1 rounded cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${event.type === "aktualnosci"
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                : event.type === "ogloszenia"
                                  ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                                  : event.type === "konkursy"
                                    ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                } ${urgent ? "ring-2 ring-red-400 animate-pulse" : ""}`}
                              title={event.title}
                            >
                              <div className="flex-shrink-0 flex items-center justify-center pointer-events-none">
                                {getEventIcon(event.type)}
                              </div>
                              <span className="truncate flex-1 text-[11px] sm:text-xs font-medium leading-tight select-none pointer-events-none">{event.title}</span>
                              {event.type === "konkursy" && daysUntil !== null && daysUntil >= 0 && (
                                <span className="text-[10px] font-bold whitespace-nowrap opacity-80 pointer-events-none">{daysUntil}d</span>
                              )}
                            </Link>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8 pt-6 border-t border-gray-200 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-50 flex items-center justify-center border border-blue-200">
              <Calendar className="w-3 h-3 text-blue-600" />
            </div>
            <span className="text-sm text-gray-600">Aktualności</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-50 flex items-center justify-center border border-purple-200">
              <Megaphone className="w-3 h-3 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Ogłoszenia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-50 flex items-center justify-center border border-amber-200">
              <Trophy className="w-3 h-3 text-amber-600" />
            </div>
            <span className="text-sm text-gray-600">Konkursy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center border border-gray-300">
              <Users className="w-3 h-3 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">Rada Rodziców</span>
          </div>
        </div>
      </div>
    </div>
  )
}
