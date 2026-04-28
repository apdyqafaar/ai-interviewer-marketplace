import React from "react"
import { GrayTitle } from "@/components/resubales"
import { Wallet, TrendingUp, Star, CheckCircle2 } from "lucide-react"

interface WalletTabProps {
  creditBalance: number
  totalEarned: number
  creditRate: number
  completedSessions: number
}

const StatCard = ({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  accent: string
}) => (
  <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 flex flex-col gap-4 group hover:border-amber-400/40 transition-colors duration-300">
    {/* Glow blob */}
    <div
      className={`pointer-events-none absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300 ${accent}`}
    />

    {/* Icon badge */}
    <span
      className={`inline-flex items-center justify-center w-11 h-11 rounded-xl border border-amber-400/30 bg-amber-400/10`}
    >
      {icon}
    </span>

    <div className="space-y-1">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
      <p className="text-4xl font-serif font-semibold">
        <GrayTitle>{value}</GrayTitle>
      </p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  </div>
)

export const WalletTab = ({
  creditBalance,
  totalEarned,
  creditRate,
  completedSessions,
}: WalletTabProps) => {
  return (
    <div className="p-4 sm:p-7 bg-card border border-border rounded-lg">

      {/* Header */}
      <div className="flex items-start gap-3 mb-8">
        <div className="space-y-1">
          <span className="mb-4 p-3 rounded-xl border border-amber-400/30 bg-amber-400/10 inline-flex items-center justify-center">
            <Wallet className="w-4 h-4 text-amber-400" />
          </span>
          <h2 className="text-xl sm:text-2xl font-serif">
            <GrayTitle>Wallet</GrayTitle>
          </h2>
          <p className="text-sm text-muted-foreground">Your earnings and credit overview</p>
        </div>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Card 1 — Credit Balance */}
        <StatCard
          icon={<Wallet className="w-5 h-5 text-amber-400" />}
          label="Credit Balance"
          value={creditBalance}
          sub="Credits available to spend"
          accent="bg-amber-400"
        />

        {/* Card 2 — Total Earned */}
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
          label="Total Earned"
          value={totalEarned}
          sub={`Across ${completedSessions} completed session${completedSessions !== 1 ? "s" : ""}`}
          accent="bg-emerald-400"
        />

        {/* Card 3 — Credit Rate & Sessions */}
        <StatCard
          icon={<Star className="w-5 h-5 text-amber-400" />}
          label="Credit Rate"
          value={`${creditRate} / hr`}
          sub={
            completedSessions > 0
              ? `${completedSessions} session${completedSessions !== 1 ? "s" : ""} completed`
              : "No sessions yet"
          }
          accent="bg-amber-300"
        />

      </div>

      {/* Divider + note */}
      <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 text-muted-foreground text-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
        Credits are charged per session based on your credit rate and session duration.
      </div>

    </div>
  )
}
