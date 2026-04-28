export type* from "../generated/prisma/client"

import { Availability, Booking } from "../generated/prisma/client"
import { AvailabilityStatus, BookingStatus, InterviewCategory, UserRole } from "../generated/prisma/enums"

export  interface OnboardingData {
    role: UserRole
    yearExp: string
    title: string
    company: string
    categories: InterviewCategory[]
    bio: string
}

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
}

export interface Interviewer {
    id: string;
    name: string | null;
    imageUrl: string | null;
    credits: number;
    bio: string | null;
    title: string | null;
    company: string | null;
    yearsExp: number | null;
    categories: InterviewCategory[];
    creditRate: number;
    creditBalance: number;
    availabilities: {
        id: string;
        status: AvailabilityStatus;
        startTime: Date;
        endTime: Date;
    }[];
    bookingAsInterviewer: {
        startTime: Date;
        endTime: Date;
    }[];
}


export interface BookingForVideoCall{
    id: string;
    startTime: Date;
    endTime: Date;
    status: BookingStatus;
    interviewer: {
        id: string;
        email: string;
        name: string | null;
        imageUrl: string | null;
        categories: InterviewCategory[];
        clerkUserId: string;
    };
    interviewee: {
        id: string;
        clerkUserId: string;
        email: string;
        name: string | null;
        imageUrl: string | null;
    };
}