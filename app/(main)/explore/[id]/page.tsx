"use server"
import { getInterviewerById } from "@/actions"
import { CATEGORY_LABEL } from "@/lib"
import { SectionLabel } from "@/components/resubales"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Building2, CalendarDays, ChevronLeft, Coins, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

// ─── Slot formatter ──────────────────────────────────────────────────────────
const fmt = (d: Date) =>
    new Date(d).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })

// ─── Page ────────────────────────────────────────────────────────────────────
const InterviewerProfilePage = async ({ params }: { params: { id: string } }) => {
    const interviewer = await getInterviewerById(params.id)
    if (!interviewer) notFound()

    const {
        name, imageUrl, title, company, bio, yearsExp,
        creditRate, categories, availabilities,
    } = interviewer

    return (
        <div className="min-h-screen px-5 md:px-20 pb-20">

            {/* Back nav */}
            <Link
                href="/explore"
                className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-white transition-colors mb-8"
            >
                <ChevronLeft className="w-4 h-4" />
                Back to Explore
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">

                {/* ── Left: Profile info ─────────────────────────────────── */}
                <div className="lg:col-span-1 flex flex-col gap-6">

                    {/* Card */}
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 flex flex-col items-center text-center gap-4">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/30">
                                {imageUrl ? (
                                    <Image src={imageUrl} alt={name ?? "Interviewer"} width={96} height={96} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-3xl">
                                        {name?.[0] ?? "?"}
                                    </div>
                                )}
                            </div>
                            {availabilities.length > 0 && (
                                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-emerald-500/40" />
                            )}
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold text-white">{name}</h1>
                            {(title || company) && (
                                <p className="text-sm text-stone-400 mt-1">
                                    {[title, company].filter(Boolean).join(" · ")}
                                </p>
                            )}
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap justify-center gap-3 text-xs text-stone-500">
                            {yearsExp != null && (
                                <span className="flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {yearsExp} yr{yearsExp !== 1 ? "s" : ""} experience
                                </span>
                            )}
                            {company && (
                                <span className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    {company}
                                </span>
                            )}
                        </div>

                        {/* Credit rate */}
                        <div className="w-full flex items-center justify-between bg-amber-500/5 border border-amber-500/20 rounded-lg px-4 py-3">
                            <span className="text-xs text-stone-400 font-medium">Session cost</span>
                            <div className="flex items-center gap-1.5">
                                <Coins className="w-4 h-4 text-amber-400" />
                                <span className="text-lg font-bold text-amber-400">{creditRate}</span>
                                <span className="text-xs text-stone-500">credit{creditRate !== 1 ? "s" : ""}</span>
                            </div>
                        </div>
                    </div>

                    {/* Specialties */}
                    {categories.length > 0 && (
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium text-white">Specialties</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <Badge
                                        key={cat}
                                        className="text-[11px] font-medium border-white/10 bg-white/[0.03] text-stone-300 hover:bg-white/[0.06] transition-colors"
                                    >
                                        {CATEGORY_LABEL[cat] ?? cat}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Right: Bio + Slots ─────────────────────────────────── */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Bio */}
                    {bio && (
                        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-3">
                            <SectionLabel>About</SectionLabel>
                            <p className="text-sm text-stone-300 leading-relaxed">{bio}</p>
                        </div>
                    )}

                    {/* Available slots */}
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-medium text-white">Available Slots</span>
                            {availabilities.length > 0 && (
                                <Badge className="ml-auto text-[10px] bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                                    {availabilities.length} open
                                </Badge>
                            )}
                        </div>

                        {availabilities.length === 0 ? (
                            <p className="text-sm text-stone-500 py-6 text-center">
                                No available slots at the moment. Check back soon.
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {availabilities.map(slot => (
                                    <div
                                        key={slot.id}
                                        className="group flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-white/[0.07] bg-white/[0.02] hover:border-amber-500/30 hover:bg-amber-500/5 transition-all cursor-pointer"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-stone-200 group-hover:text-white transition-colors">
                                                {fmt(slot.startTime)}
                                            </p>
                                            <p className="text-xs text-stone-600 mt-0.5">
                                                until {new Date(slot.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                                            </p>
                                        </div>
                                        <Link href={`/explore/${interviewer.id}/book?slotId=${slot.id}`}>
                                            <Button
                                                size="sm"
                                                className="text-xs bg-amber-400 hover:bg-amber-300 text-black font-semibold px-3 h-8 shrink-0"
                                            >
                                                Book
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InterviewerProfilePage
