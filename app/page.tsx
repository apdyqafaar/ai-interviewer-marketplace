import { HexagonBackground } from "@/components/animate-ui/components/backgrounds/hexagon";
import { CodeDemo } from "@/components/demo-components-animate-code";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import { PricingSection } from "@/components/PricingPlans";
import { GoldTitle, GrayTitle, SectionHeading, SectionLabel } from "@/components/resubales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AI_TAGS, AVATARS, LOGOS, ROLES, SLOTS } from "@/lib";
import { PricingTable } from "@clerk/nextjs";
import { Bot, CalendarDays, Check, Lock, Mail, Sparkles, Video, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className=" overflow-x-hidden">
      {/* header */}

      <section className="min-h-screen pt-28 lg:pt-32 relative  px-4 md:px-10 grid grid-cols-1 lg:grid-cols-5 pb-20 overflow-hidden">
        <StarsBackgroundDemo />

        <div className=" relative col-span-full lg:col-span-3 rounded-md  flex flex-col items-center justify-center text-center lg:-rotate-2">
          <Badge className="bg-background text-amber-500 border-amber-500">Powered by Ai - Now in Beta</Badge>
          <h1 className="font-serif relative text-5xl sm:text-6xl lg:text-7xl tracking-tighter max-w-4xl">
            <GrayTitle>Ace your next interview</GrayTitle>
            <br />
            <GoldTitle>With real experts</GoldTitle>

          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-6 leading-relaxed">Book 1:1 mock interview with senior engineering from top companies. Get Ai-powered feedback, role-specific question, and the confidence to land your dream job</p>

          <div className="flex item-center gap-3 mt-6">
            <Link href={"/onboarding"}>
              <Button className="py-6 px-8 text-lg bg-amber-400 hover:bg-amber-500 transition-colors">
                get started
              </Button>
            </Link>

            <Link href={"/brows"}>
              <Button variant={"outline"} className="py-6 px-8 text-lg text-amber-400 hover:text-amber-500 transition-colors">
                Browse Interviews
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-10">
            <div className="flex">
              {
                AVATARS.map((av, i) => (
                  <div key={i} className={`w-8 h-8 bg-background rounded-full border-2 border-foreground overflow-hidden ${i > 0 && "-ml-2"}`}>
                    <Image width={32} height={32} src={av.src} alt="User image" className="w-full h-full object-cover" />
                  </div>
                ))
              }
            </div>
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              <strong className="font-medium">2400 + engineers</strong>{" "}
              cracked FAANG Interviews bia Mocktail
            </p>
          </div>

        </div>
        <div className="col-span-full lg:col-span-2 flex items-center justify-center lg:justify-start mt-12 lg:mt-0 lg:rotate-3">

          <CodeDemo duration={3000} writing delay={200} cursor />
        </div>

      </section>


      <section className="relative z-10 border-y border-foreground/10 py-14">
        <p className="text-center text-xs font-medium text-muted-foreground tracking-widest uppercase mb-8">Interviewees landed roles at</p>
        <div className=" flex flex-wrap items-baseline justify-center gap-24 px-6">
          {
            LOGOS.map(l => (
              <Image
                key={l.alt}
                src={l.src}
                alt={l.alt}
                width={50}
                height={50}
                className="h-6 w-auto opacity-60 grayscale"
              />
            ))
          }
        </div>
      </section>

      <section className="relative z-10 py-28 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>Features</SectionLabel>
          <SectionHeading gold="nothing yoy don't" gray="Everything you need" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* --- AI QUESTION GENERATOR --- */}
          <div className="col-span-12 md:col-span-7">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Bot className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold"><GrayTitle>AI Question Generator</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get a live AI co-pilot that generates role-specific questions on demand—System Design, Behavioral, or DSA—tailored exactly to the candidate's experience level.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {AI_TAGS.map((t) => (
                    <Badge
                      key={t.label}
                      className={`px-2 py-0.5 text-[10px] uppercase tracking-wider ${t.active
                        ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                        : "bg-background text-stone-500 border-transparent"
                        }`}
                    >
                      {t.label}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* --- CREDITS SYSTEM --- */}
          <div className="col-span-12 md:col-span-5">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Wallet className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold"><GrayTitle>Credits System</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground">
                    Simple, transparent booking. Subscribe for monthly credits to book sessions, while interviewers earn and withdraw earnings anytime.
                  </p>
                </div>
                <div className="mt-auto border border-white/5 bg-white/[0.02] p-4 rounded-xl space-y-2">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Your Balance</span>
                  <div className="flex items-end justify-between">
                    <h1 className="text-4xl font-mono"><GoldTitle>28</GoldTitle></h1>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">+10 this month</Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* --- HD VIDEO CALLS --- */}
          <div className="col-span-12 md:col-span-4">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Video className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold"><GrayTitle>HD Video Calls</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground">
                    Ultra-low latency powered by Stream. Includes screen sharing, automated recording, and instant playback.
                  </p>
                </div>
              </CardHeader>
              <div className="mt-6 w-full h-32 opacity-50 overflow-hidden rounded-lg">
                <HexagonBackground />
              </div>
            </Card>
          </div>

          {/* --- PERSISTENT CHAT --- */}
          <div className="col-span-12 md:col-span-4">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Mail className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold"><GrayTitle>Persistent Chat</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground">
                    Message your interviewer before or after the session. Share resources, follow-up notes, and feedback in a permanent thread.
                  </p>
                </div>
              </CardHeader>
              <div className="mt-6 p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-2">
                <div className="h-2 w-2/3 bg-stone-700 rounded animate-pulse" />
                <div className="h-2 w-1/2 bg-stone-800 rounded animate-pulse" />
              </div>
            </Card>
          </div>

          {/* --- SECURE DATA --- */}
          <div className="col-span-12 md:col-span-4">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Lock className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold"><GrayTitle>Secure & Private</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade encryption for every call. Your interview data and AI feedback reports are strictly private.
                  </p>
                </div>
              </CardHeader>
              <div className="mt-6 w-full h-32 opacity-50 overflow-hidden rounded-lg">
                <HexagonBackground />
              </div>
            </Card>
          </div>

          {/* --- AI FEEDBACK ANALYSIS --- */}
          <div className="col-span-12 md:col-span-6">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold"><GrayTitle>AI Feedback Analysis</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Get an instant, deep-dive report after every session. Our AI analyzes your technical accuracy, communication clarity, and confidence levels to give you actionable improvement steps.
                  </p>
                </div>

                {/* Visual Feedback Preview */}
                <div className="mt-4 space-y-3 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                    <span>TECHNICAL DEPTH</span>
                    <span className="text-amber-400">88%</span>
                  </div>
                  <div className="h-1.5 w-full  rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[88%] rounded-full" />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-stone-400">
                    <span>COMMUNICATION</span>
                    <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="h-1.5 w-full  rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%] rounded-full" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* --- SLOT-BASED SCHEDULING --- */}
          <div className="col-span-12 md:col-span-6">
            <Card className="h-full p-6 flex flex-col border-white/5 ">
              <CardHeader className="p-0 space-y-4 flex-1">
                <div className="w-fit p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <CalendarDays className="w-6 h-6 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold"><GrayTitle>Smart Scheduling</GrayTitle></h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pick a time that works for you. Our slot-based system handles time zones automatically and syncs directly with your Google Calendar for seamless Mocktail sessions.
                  </p>
                </div>

                {/* Dynamic Slots Mapping */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {SLOTS.map((slot) => (
                    <Badge
                      key={slot.label}
                      variant="outline"
                      className={`px-3 py-1.5 text-xs font-medium transition-all cursor-pointer hover:scale-105 ${slot.cls}`}
                    >
                      {slot.label}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>


        </div>
      </section>

      <section className="relative z-10 py-28 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>WHO IT'S FOR</SectionLabel>
          <SectionHeading gold="of the table" gray="Built for both side" />
        </div>

        {/* // ... inside your component */}

        <div className="grid grid-cols-12 gap-8 mt-16">
          {ROLES.map((role) => {
            const isInterviewer = role.label === "Interviewer";

            return (
              <div key={role.label} className="col-span-12 md:col-span-6">
                {/* Removed background, using transparent card with subtle border */}
                <div className="h-full flex flex-col p-8 rounded-3xl border border-white/10 transition-all hover:border-white/20">

                  {/* Header */}
                  <div className="mb-8">
                    <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${isInterviewer ? "text-amber-500" : "text-stone-500"
                      }`}>
                      {role.label}
                    </h3>
                    <h2 className="text-3xl font-serif mb-4 leading-tight">
                      {isInterviewer ? (
                        <GoldTitle>Earn doing what you're great at</GoldTitle>
                      ) : (
                        <GrayTitle>Land the role you deserve</GrayTitle>
                      )}
                    </h2>
                    <p className="text-stone-400 text-sm leading-relaxed">
                      {role.desc}
                    </p>
                  </div>

                  {/* Perks with Styled Checkboxes */}
                  <div className="space-y-4 flex-1">
                    {role.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-4 group cursor-default">
                        {/* Custom Styled Checkbox Container */}
                        <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded border transition-all shrink-0 ${isInterviewer
                          ? "border-amber-500/30 bg-amber-500/5 group-hover:border-amber-500"
                          : "border-stone-500/30 bg-stone-500/5 group-hover:border-stone-300"
                          }`}>
                          <Check className={`w-3.5 h-3.5 ${isInterviewer ? "text-amber-500" : "text-stone-300"
                            }`} strokeWidth={3} />
                        </div>

                        <span className="text-sm text-stone-300 group-hover:text-white transition-colors">
                          {perk}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Link href={"/onboarding"} className="min-w-full">
                    <button className={`w-full mt-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${isInterviewer
                      ? "bg-amber-400 text-black hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                      : "border border-white/20 text-white hover:bg-white/5"
                      }`}>
                      Join as {role.label}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>


      </section>


      <section className="relative py-28 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <SectionLabel>PRICING</SectionLabel>
          <SectionHeading gold="credits-based plans" gray="Simple, transparent" />
          <p className="text-xs text-muted-foreground">Each credit = one session. Unused credits roll over.</p>
        </div>
        {/* <PricingSection/> */}
        <PricingTable checkoutProps={{
          appearance: {
            elements: {
              drawerRood: {
                zIndex: 2000
              }
            }
          }
        }} />
      </section>


      <section className="relative z-10 pb-28 max-w-5xl mx-auto px-6">
        <div className="relative border border-border rounded-lg px-3 sm:px-16 py-20 overflow-hidden ">
          <StarsBackgroundDemo />
          <h2 className="text-center font-serif relative text-4xl md:text-5xl leading-tight tracking-tight mb-4">
            <GrayTitle>Your next interviewer</GrayTitle>
            <br />

          </h2>
          <h3 className="text-center font-serif relative text-4xl md:text-5xl leading-tight tracking-tight mb-4">
            <GoldTitle>Your next interviewer</GoldTitle>
            <br />

          </h3>
          <br />
          <p className="relative text-center text-muted-foreground">Join thousands of engineers already leveling up</p>

          <div className="relative flex item-center justify-center w-full gap-3 mt-6">
            <Link href={"/onboarding"}>
              <Button className="py-6 px-8 text-lg bg-amber-400 hover:bg-amber-500 transition-colors">
                get started
              </Button>
            </Link>

            <Link href={"/brows"}>
              <Button variant={"outline"} className="py-6 px-8 text-lg text-amber-400 hover:text-amber-500 transition-colors">
                Browse Interviews
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
