import { PLANS } from "@/lib";
import { Check, Star } from "lucide-react";
import { Button } from "./ui/button";

export function PricingSection() {
  return (
    <div className="grid grid-cols-12 gap-8 mt-20">
      {PLANS.map((plan) => {
        const isFeatured = plan.featured;

        return (
          <div key={plan.slug} className="col-span-12 lg:col-span-4">
            <div 
              className={`relative h-full flex flex-col p-8 rounded-3xl border transition-all duration-500 ${
                isFeatured 
                ? "border-amber-500/50 bg-amber-500/[0.02] shadow-[0_0_40px_rgba(251,191,36,0.05)]" 
                : "border-border bg-transparent"
              }`}
            >
              {/* Popular Badge */}
              {isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full bg-amber-400 text-[10px] font-bold uppercase tracking-widest text-black shadow-xl">
                  <Star className="w-3 h-3 fill-current" />
                  Most Popular
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-4 ${
                  isFeatured ? "text-amber-500" : "text-stone-500"
                }`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-serif tracking-tighter text-muted-foreground">
                    {plan.price}
                  </span>
                  <span className="text-stone-500 text-sm">/month</span>
                </div>
                
                <p className={`text-xs font-medium py-1 px-3 rounded-md w-fit ${
                  isFeatured ? "bg-amber-400/10 text-amber-500" : "bg-white/5 text-stone-400"
                }`}>
                  {plan.credits}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4 flex-1 mb-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-600">What's included</p>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 group">
                      <div className={`mt-1 flex items-center justify-center w-5 h-5 rounded-full border shrink-0 transition-colors ${
                        isFeatured 
                        ? "border-amber-500/30 bg-amber-500/5 group-hover:border-amber-400" 
                        : "border-white/10 bg-white/5 group-hover:border-stone-400"
                      }`}>
                        <Check className={`w-3 h-3 ${
                          isFeatured ? "text-amber-500" : "text-stone-500"
                        }`} strokeWidth={3} />
                      </div>
                      <span className="text-sm text-stone-300 group-hover:text-muted-foreground transition-colors">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Button */}
              <Button 
              variant={"outline"}
                className={`w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98] ${
                  isFeatured 
                  ? "bg-amber-400 text-black hover:bg-amber-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]" 
                  : ""
                }`}
              >
                {plan.price === "$0" ? "Get Started" : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}