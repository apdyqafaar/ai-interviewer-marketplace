"use client"
import { InterviewCategory } from '@/lib/types';
import { Search, Briefcase, Star, Clock, Coins } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '../../../../components/ui/input';
import { CATEGORIES, CATEGORY_LABEL } from '@/lib';
import { Button } from '../../../../components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '../../../../components/ui/badge';

interface Interviewer {
    id: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
    bio: string | null;
    title: string | null;
    company: string | null;
    yearsExp: number | null;
    categories: InterviewCategory[];
    creditRate: number;
    availabilities: {
        id: string;
        startTime: Date;
        endTime: Date;
    }[];
}

// ─── Interviewer Card ────────────────────────────────────────────────────────

const InterviewerCard = ({ i }: { i: Interviewer }) => {
    const isAvailable = i.availabilities.length > 0;
    const nextSlot = i.availabilities[0];

    const formatSlot = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className="group relative flex flex-col rounded-xl  border hover:border-amber-500/20 transition-all duration-300 overflow-hidden border-border">

            {/* Subtle top glow on hover */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/0 to-transparent group-hover:via-amber-500/40 transition-all duration-500" />

            <div className="p-5 flex flex-col gap-4 flex-1">

                {/* Header row: avatar + name/title + availability */}
                <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-amber-500/30 transition-colors duration-300">
                            {i.imageUrl ? (
                                <Image
                                    src={i.imageUrl}
                                    alt={i.name ?? 'Interviewer'}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-semibold text-lg">
                                    {i.name?.[0] ?? '?'}
                                </div>
                            )}
                        </div>
                        {/* Online dot */}
                        {isAvailable && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-emerald-500/30" />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-md text-foreground truncate leading-tight">{i.name ?? 'Unknown'}</p>
                        <p className="text-sm text-stone-400 truncate mt-0.5">
                            {[i.title, i.company].filter(Boolean).join(' · ')}
                        </p>
                    </div>

                    {/* years of experience */}
                    <Badge className='p-3 ' variant={"outline"}>{i.yearsExp} + {i.yearsExp !== 1 ? 'years' : 'year'}</Badge>
                </div>

                {/* Bio */}
                {i.bio && (
                    <p className="text-base text-stone-400 leading-relaxed line-clamp-2 my-2">{i.bio}</p>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-4 text-sm text-stone-500">
                    {i.yearsExp != null && (
                        <span className="flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" />
                            {i.yearsExp} yr{i.yearsExp !== 1 ? 's' : ''} exp
                        </span>
                    )}
                    {i.categories.length > 0 && (
                        <span className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-amber-500/60" />
                            {i.categories.length} specialit{i.categories.length !== 1 ? 'ies' : 'y'}
                        </span>
                    )}
                </div>

                {/* Category tags */}
                {i.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {i.categories.slice(0, 4).map(cat => (
                            <span
                                key={cat}
                                className="text-sm font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-border text-amber-400"
                            >
                                {CATEGORY_LABEL[cat] ?? cat}
                            </span>
                        ))}
                        {i.categories.length > 4 && (
                            <span className="text-sm font-medium px-2 py-0.5 rounded bg-white/5 border border-border text-amber-400">
                                +{i.categories.length - 4} more
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Footer: availability + CTA */}
            <div className="border-t border-white/[0.06] px-5 py-3 flex items-center justify-between gap-3 bg-white/[0.01]">
                {isAvailable ? (
                   <div className="flex flex-col text-sm gap-2">
                    {/* per session */}
                    <div className="text-muted-foreground truncate">
                        <span className="truncate">{i.creditRate} credits / session</span>
                    </div>
                     {/* next slot */}
                     <div className="flex items-center gap-1.5 text-xs text-emerald-400 truncate">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{formatSlot(nextSlot.startTime)}</span>
                    </div>
                   </div>
                ) : (
                    <span className="text-xs text-stone-600">No slots available</span>
                )}

                
                    <Link href={`/interviewers/${i.id}`}>
                    <Button
                        size="lg"
                        variant={"outline"}
                        disabled={!isAvailable}
                        className="shrink-0 text-xs bg-amber-400/20 px-5 hover:bg-amber-400/30 text-amber-500 border-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                       View Profile 
                    </Button>
                </Link>
               
            </div>
        </div>
    );
};

// ─── Explore Grid ────────────────────────────────────────────────────────────

const ExploreGrid = ({ interviewers }: { interviewers: Interviewer[] }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');

    const filtered = useMemo(() => {
        return interviewers.filter(i => {
            const matchesCategory =
                activeCategory === null || i.categories.includes(activeCategory as InterviewCategory);
            const q = search.toLowerCase();
            const matchesSearch =
                !q ||
                i.name?.toLowerCase().includes(q) ||
                i.bio?.toLowerCase().includes(q) ||
                i.company?.toLowerCase().includes(q) ||
                i.title?.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [interviewers, search, activeCategory]);

    return (
        <div className="flex flex-col gap-8">
            {/* Search + filters */}
            <div className="flex flex-col gap-4">
                <div className="relative max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, title or company..."
                        className="pl-8 py-5 bg-white/[0.03] border-white/[0.08] focus:border-amber-500/40 transition-colors"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => {
                        const isActive = activeCategory === c.value;
                        return (
                            <button
                                key={String(c.value)}
                                onClick={() => setActiveCategory(c.value as string | null)}
                                className={`animate-in fade-in zoom-in-95 duration-200 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap border transition-all ${isActive
                                    ? 'bg-amber-500/10 border-amber-500/60 text-amber-400'
                                    : 'bg-white/[0.03] border-white/[0.07] text-stone-400 hover:border-white/20 hover:text-stone-300'
                                    }`}
                            >
                                {c.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="text-white font-medium">{filtered.length}</span> interviewer{filtered.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Grid or empty state */}
            {filtered.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.07] flex items-center justify-center">
                        <Search className="w-7 h-7 text-stone-600" />
                    </div>
                    <div>
                        <p className="text-stone-300 font-medium">No interviewers found</p>
                        <p className="text-sm text-stone-600 mt-1">Try adjusting your filters or search term.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => { setActiveCategory(null); setSearch(''); }}
                        className="mt-2 border-white/10 text-stone-400 hover:text-white"
                    >
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(i => <InterviewerCard key={i.id} i={i} />)}
                </div>
            )}
        </div>
    );
};

export default ExploreGrid;