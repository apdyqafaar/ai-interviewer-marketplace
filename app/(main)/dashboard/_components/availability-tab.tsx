"use client"
import { saveAvailability } from "@/actions/dashboard"
import { GrayTitle } from "@/components/resubales"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import useFetch from "@/hooks/use-fetch"
import { Clock } from "lucide-react"
import { useState } from "react"

interface InitialProps {
  initialStartTime?: Date
  initialEndTime?: Date
  initialStatus?: string
  isActive?: boolean
}

export const AvailabilityTab = ({
  initialEndTime,
  initialStartTime,
  initialStatus,
  isActive,
}: InitialProps) => {
  const [startTime, setStartTime] = useState<Date | null>(
    initialStartTime ? new Date(initialStartTime) : null
  )
  const [endTime, setEndTime] = useState<Date | null>(
    initialEndTime ? new Date(initialEndTime) : null
  )
  const [status, setStatus] = useState<string>(initialStatus ?? "")
  const { data, error, fn, loading } = useFetch<{ success: boolean; error?: string }>(saveAvailability)

  // Convert Date → "HH:MM" for the time input value
  const toTimeValue = (date: Date | null) => {
    if (!date) return ""
    const h = date.getHours().toString().padStart(2, "0")
    const m = date.getMinutes().toString().padStart(2, "0")
    return `${h}:${m}`
  }

  // Convert "HH:MM" string → today's Date object
  const fromTimeValue = (value: string): Date => {
    const [h, m] = value.split(":").map(Number)
    const d = new Date()
    d.setHours(h, m, 0, 0)
    return d
  }

  // Live duration calculation
  const durationMinutes =
    startTime && endTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 60000)
      : null

  const formatDuration = (mins: number) => {
    if (mins <= 0) return "Invalid range"
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
  }

  const handleSave = async () => {
    if (!startTime || !endTime) return
    await fn({ startTime, endTime })
  }

  return (
    <div className="my-6">
      <div className="flex flex-col gap-4">
        <div className="p-4 sm:p-7 bg-card border border-border rounded-lg">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="mb-4 p-3 rounded-xl border border-amber-400/30 bg-amber-400/10 inline-flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-400" />
              </span>
              <h2 className="text-xl sm:text-2xl font-serif">
                <GrayTitle>Daily Availability window</GrayTitle>
              </h2>
              <p className="text-sm text-muted-foreground">Set your daily availability for interviews</p>
            </div>

            {!isActive && (
              <Badge className="gap-2 bg-green-500/20 text-green-400 border-green-500/20">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                Active
              </Badge>
            )}
          </div>

          <Separator className="my-6" />

          {/* Inputs + duration badge + save */}
          <div className="flex flex-col gap-6">

            {/* Time inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Start Time */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
                  <input
                    type="time"
                    value={toTimeValue(startTime)}
                    onChange={(e) =>
                      e.target.value
                        ? setStartTime(fromTimeValue(e.target.value))
                        : setStartTime(null)
                    }
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg
                      text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/40
                      focus:border-amber-400/60 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* End Time */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
                  <input
                    type="time"
                    value={toTimeValue(endTime)}
                    onChange={(e) =>
                      e.target.value
                        ? setEndTime(fromTimeValue(e.target.value))
                        : setEndTime(null)
                    }
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg
                      text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/40
                      focus:border-amber-400/60 disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Live duration badge */}
            {durationMinutes !== null && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Duration:</span>
                <Badge
                  className={`gap-1.5 text-xs font-semibold border ${
                    durationMinutes > 0
                      ? "bg-amber-500/15 text-amber-400 border-amber-500/25"
                      : "bg-red-500/15 text-red-400 border-red-500/25"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  {formatDuration(durationMinutes)}
                </Badge>
                <p className="text-xs text-muted-foreground">This is the current duration of your availability window.</p>
              </div>
            )}

            {/* Feedback */}
            {error && (
              <p className="text-xs text-red-400">{(error as Error)?.message ?? "Something went wrong"}</p>
            )}
            {data?.error && (
              <p className="text-xs text-red-400">{data.error}</p>
            )}
            {data?.success && (
              <p className="text-xs text-green-400">Availability saved successfully!</p>
            )}

            {/* Save button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={
                  (startTime?.toString()===initialStartTime?.toString() && endTime?.toString()===initialEndTime?.toString())||
                  loading ||
                  !startTime ||
                  !endTime ||
                  (durationMinutes !== null && durationMinutes <= 0)
                }
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium
                  bg-amber-500/20 text-amber-400 border border-amber-500/30
                  hover:bg-amber-500/30 hover:border-amber-500/50
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-all duration-200"
              >
                {loading ? (
                  <>
                    <span className="inline-block w-3.5 h-3.5 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save Availability"
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
