import { generateFeedback } from "@/lib/helpers/aiHelpers";
import { db } from "@/lib/prisma";
import { NextRequest } from "next/server";
export async function POST(request: NextRequest) {
  console.log("[webhook] triggered");
  const body = await request.json();
  const eventType = body.type;

  if (
    eventType !== "call.transcription_ready" &&
    eventType !== "call.recording_ready"
  ) {
    console.log("[webhook] invalid event type");
    return Response.json({ error: "Invalid event type" }, { status: 400 });
  }
  console.log("[webhook] event type", eventType);
  //    stream call id
  const callCid = (body.call_cid as string) ?? "";
  const streamCallId = callCid.includes(":") ? callCid.split(":")[1] : callCid;
  console.log("[webhook] call cid", callCid);
  console.log("[webhook] stream call id", streamCallId);
  if (!streamCallId) {
    return Response.json({ error: "Invalid call id" }, { status: 400 });
  }

  try {
    const booking = await db.booking.findUnique({
      where: { streamCallId: streamCallId },
      include: {
        interviewer: {
          select: { id: true, clerkUserId: true, name: true, categories: true },
        },
        interviewee: {
          select: { id: true, clerkUserId: true, name: true },
        },
        feedback: { select: { id: true } },
      },
    });

    if (!booking) {
      return Response.json({ error: "Booking not found" }, { status: 404 });
    }

    // Recording Ready
    if (eventType === "call.recording_ready") {
      const recordingUrl = (body.call_recording?.url as string) ?? "";
      if (recordingUrl) {
        await db.booking.update({
          where: { id: booking.id },
          data: { recordingUrl },
        });
        return Response.json({ success: true });
      }
    }

    // transcription Ready
    if (eventType === "call.transcription_ready") {
      if (booking.feedback) return Response.json({ success: true });

      const TransUrl = (body.call_transcription?.url as string) ?? "";
      if (!TransUrl)
        return Response.json(
          { error: "Invalid transcription url" },
          { status: 400 },
        );

      // first downlaod
      const transcripts = await fetch(TransUrl);
      const text = await transcripts.text();

      // parse into readable conversation
      const lines = text
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((l) => {
          try {
            return JSON.parse(l);
          } catch (error) {
            return null;
          }
        })
        .filter((entry) => entry?.type === "speech");

      if (lines.length === 0) {
        return Response.json(
          { error: "No speech segments found" },
          { status: 400 },
        );
      }

      const speakerMap = {
        [booking.interviewer.clerkUserId]:
          booking.interviewer.name || "Interviewer",
        [booking.interviewee.clerkUserId]:
          booking.interviewee.name || "Interviewee",
      };

      const transcript = lines
        .map(
          (l: any) => `
               ${speakerMap[l.speaker_id as string] ?? l.speaker_id}:${l.text}
            `,
        )
        .join("\n");
      const categories = booking.interviewer.categories.join(",") ?? "General";
      const prompt = `You are an expert technical interviewer evaluating a mock interview.

Interview categories: ${categories}
Interviewer: ${booking.interviewer.name}
Candidate: ${booking.interviewee.name}

TRANSCRIPT:
${transcript}

Analyze the candidate's performance. Respond ONLY with a valid JSON object, no markdown, no backticks, no explanation:
{
  "summary": "2-3 sentence overall summary of the session",
  "technical": "Assessment of technical knowledge and accuracy",
  "communication": "Assessment of clarity, structure, and communication style",
  "problemSolving": "Assessment of problem-solving approach and thought process",
  "recommendation": "HIRE / CONSIDER / NO_HIRE with a one-sentence reason",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "overallRating": "POOR or AVERAGE or GOOD or EXCELLENT"
}`;

      //    generating feed back with open ai model
      const feedback = await generateFeedback(prompt);
      console.log("ai feed back",feedback)
      const result=feedback?.toString().trim().replace(/^```json|^```/gm,"")
      const feedbackJson=JSON.parse(result)

    //   update the docs
    await db.$transaction([
        db.feedback.upsert({
            where:{bookingId:booking.id},
            update:{},
            create:{
                bookingId:booking.id,
                summary:feedbackJson.summary,
                technical:feedbackJson.technical,
                communication:feedbackJson.communication,
                problemSolving:feedbackJson.problemSolving,
                recommendation:feedbackJson.recommendation,
                strengths:feedbackJson.strengths,
                improvements:feedbackJson.improvements,
                overallRating:feedbackJson.overallRating
            }
        }),
        db.booking.update({
            where:{id:booking.id},
            data:{status:"COMPLETED"}
        })
    ])
    // Credits transaction outside
    const earnExists=await db.creditTransaction.findFirst({
        where:{bookingId:booking.id, type:"BOOKING_EARING"},
        select:{id:true}
    })
    if(!earnExists){
      // update the interviewer credits and transactions
      const creditToAward=await db.creditTransaction.create({
        data:{
          userId:booking.interviewer.clerkUserId,
          type:"BOOKING_EARING",
          amount:booking.creditsCharged,
          bookingId:booking.id,
        }
      })
    
    }
}
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

  return Response.json({ success: true });
}
