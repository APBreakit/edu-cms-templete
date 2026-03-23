import { Card } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import CalendarView from "@/components/admin/calendar-view"
import { getCalendarEvents } from "@/app/actions/admin-actions"
export const dynamic = "force-dynamic"

export default async function CalendarPage() {
  const events = await getCalendarEvents()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kalendarz wydarzeń</h1>
          <p className="text-gray-600 mt-1">Przeglądaj wszystkie wydarzenia dodane do kalendarza</p>
        </div>
      </div>

      <Card className="p-6">
        <CalendarView events={events} />
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Nadchodzące wydarzenia</h2>
        </div>
        <div className="space-y-3">
          {events && events.length > 0 ? (
            events.slice(0, 10).map((event) => (
              <a
                key={event.id}
                href={`/admin/posts/${event.id}`}
                className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex-shrink-0 w-16 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {event.calendar_date ? new Date(event.calendar_date).getDate() : "?"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {event.calendar_date
                      ? new Date(event.calendar_date).toLocaleDateString("pl-PL", { month: "short" })
                      : ""}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        event.type === "aktualnosci"
                          ? "bg-blue-100 text-blue-700"
                          : event.type === "ogloszenia"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {event.type === "aktualnosci"
                        ? "Aktualność"
                        : event.type === "ogloszenie" || event.type === "ogloszenia"
                          ? "Ogłoszenie"
                          : "Konkurs"}
                    </span>
                  </div>
                  {event.excerpt && <p className="text-sm text-gray-600">{event.excerpt}</p>}
                  <div className="text-xs text-gray-500 mt-2">
                    {event.calendar_date ? new Date(event.calendar_date).toLocaleString("pl-PL") : ""}
                    {event.calendar_end_date && ` - ${new Date(event.calendar_end_date).toLocaleString("pl-PL")}`}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center py-12 text-gray-600">
              <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>Brak wydarzeń w kalendarzu</p>
              <p className="text-sm mt-1">Dodaj posty do kalendarza, aby je tutaj zobaczyć</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
