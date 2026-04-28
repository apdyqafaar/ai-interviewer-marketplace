"use client";
import { GoldTitle, GrayTitle, SectionLabel } from "@/components/resubales";
import { Button } from "@/components/ui/button";
import { ONBOARDING_ROLES } from "@/lib";
import { CATEGORIES } from "@/lib/data";
import { InterviewCategory } from "@/lib/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { saveOnboardingData } from "@/actions/onboarding";

const OnboardingPage = () => {
  // const {data, mutateAsync, isPending:loading}=useOnboard()
  const { data, loading, error, fn } = useFetch(saveOnboardingData);
  const [role, setRole] = useState<
    "INTERVIEWER" | "INTERVIEWEE" | "UNASSIGNED" | null
  >(null);
  const [form, setForm] = useState({
    yearExp: "",
    title: "",
    company: "",
    categories: [] as InterviewCategory[],
    bio: "",
  });
  // const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (data && !loading) {
      router.push(role === "INTERVIEWER" ? "/dashboard" : "/explore");
    }
  }, [data, router]);

  const isInterviewerValid=role === "INTERVIEWER" &&
        (form.yearExp &&
          form.title.trim() &&
          form.company.trim() &&
          form.categories.length > 0 &&
          form.bio.trim())

  const isReadyToSubmit=(role === "INTERVIEWER" && isInterviewerValid )|| role === "INTERVIEWEE"

  const handleSubmit = async () => {
    console.log(role)
    if(!isReadyToSubmit ){
      toast.error("Please select a role and fill all the fields")
      return
    }

    // setLoading(true)
    try {
      await fn({
        role,
        ...(role === "INTERVIEWER" && {
          yearExp: Number(form.yearExp),
          title: form.title.trim(),
          company: form.company.trim(),
          categories: form.categories,
          bio: form.bio.trim(),
        }),
      });
      console.log(data);
      toast.success("Onboarding completed successfully!");
      //    router.push("/dashboard")
    } catch (error) {
      toast.error("Something went wrong while saving your details");
    }
  };
  return (
    <div className="min-h-screen px-6 py-20 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <SectionLabel>Welcome</SectionLabel>
          <h1 className="text-4xl sm:text-5xl mb-1 lg:text-6xl font-serif tracking-tighter">
            <GrayTitle>How will you be</GrayTitle>
            <br />
            <GoldTitle>using Mocktail?</GoldTitle>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mt-6 leading-relaxed">
            This helps us personalize your onboarding experience
            <span className="text-muted-foreground">
              {" "}
              You can change this later.
            </span>
          </p>
        </div>

        {!role && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ONBOARDING_ROLES.map((o) => (
              <button
                className="text-left rounded-xl p-8 border border-border bg-background hover:translate-y-0.5 transition-all duration-300 hover:cursor-pointer"
                key={o.value}
                onClick={() =>
                  setRole(
                    o.value as "INTERVIEWER" | "INTERVIEWEE" | "UNASSIGNED",
                  )
                }
              >
                <span className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl mb-5">
                  {o.icon}
                </span>
                <h3 className="font-serif text-xl tracking-tight mb-2">
                  {o.title}
                </h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  {o.desc}
                </p>
              </button>
            ))}
          </div>
        )}

        {role && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between bg-background border border-border rounded-xl px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl">
                  {ONBOARDING_ROLES.find((o) => o.value === role)?.icon}
                </span>
                <div className="flex flex-col">
                  <h3 className="font-serif text-base tracking-tight">
                    {ONBOARDING_ROLES.find((o) => o.value === role)?.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">Selected role</p>
                </div>
              </div>
              <Button variant={"outline"} onClick={() => setRole(null)}>
                Change role
              </Button>
            </div>
            {role === "INTERVIEWER" && (
              <div className="bg-background border border-border rounded-xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="font-serif text-2xl mb-8 border-b border-border/50 pb-4">
                  Complete your interviewer profile
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-muted-foreground ml-1"
                      >
                        Job Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="e.g. Senior Frontend Engineer"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-muted-foreground ml-1"
                      >
                        Company
                      </Label>
                      <Input
                        id="company"
                        placeholder="e.g. Meta"
                        value={form.company}
                        onChange={(e) =>
                          setForm({ ...form, company: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label
                        htmlFor="yearExp"
                        className="text-muted-foreground ml-1"
                      >
                        Years of Experience
                      </Label>
                      <Input
                        id="yearExp"
                        type="number"
                        placeholder="5"
                        value={form.yearExp}
                        onChange={(e) =>
                          setForm({ ...form, yearExp: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-muted-foreground ml-1">
                      Interview Categories (Select all that apply)
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.filter((c) => c.value).map((c) => {
                        const selected = form.categories.includes(
                          c.value as InterviewCategory,
                        );
                        return (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              if (selected) {
                                setForm({
                                  ...form,
                                  categories: form.categories.filter(
                                    (val) => val !== c.value,
                                  ),
                                });
                              } else {
                                setForm({
                                  ...form,
                                  categories: [
                                    ...form.categories,
                                    c.value as InterviewCategory,
                                  ],
                                });
                              }
                            }}
                            className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${selected ? "bg-amber-400/10 border border-amber-400/20 text-amber-400 font-semibold" : "bg-white/5 border border-white/10 hover:bg-white/10 text-stone-300"}`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-muted-foreground ml-1">
                      Short Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Share a brief overview of your background, achievements, and interviewing philosophy..."
                      rows={4}
                      value={form.bio}
                      onChange={(e) =>
                        setForm({ ...form, bio: e.target.value })
                      }
                      className="resize-y"
                    />
                  </div>
                </div>
              </div>
            )}
            <Button
              className="w-full py-6 mt-4 text-sm font-bold uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.1)] transition-all rounded-xl"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading
                ? "Setting up your account..."
                : role === "INTERVIEWER"
                  ? "Create Interviewer Profile"
                  : "Explore Interviewers"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
