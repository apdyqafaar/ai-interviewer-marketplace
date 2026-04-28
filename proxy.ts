import arcjet, { detectBot, shield } from '@arcjet/next';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/bookings(.*)",
  "/profile(.*)",
  "/settings(.*)",
  "/appointments(.*)",
  "/explore(.*)",
])
const isWebhook=createRouteMatcher([
  "/api/webhooks/stream(.*)",
])

const aj=arcjet({
  key:process.env.ARCJET_KEY!,
  rules:[
    shield({mode:"LIVE"}),
    detectBot({
      mode:"LIVE",
      allow:["CATEGORY:ADVERTISING","CATEGORY:SEARCH_ENGINE","CATEGORY:PREVIEW"]
    })
  ]
})
export default clerkMiddleware(async (auth, req) => {
  // original url
  if(!isWebhook(req)){
    const decision=await aj.protect(req)
  if(decision.isDenied()){
    return NextResponse.json({error:"Access Denied"},{status:403})
  }
  }
  const { userId } = await auth()

  if (!userId && isProtectedRoute(req)) {
    const { redirectToSignIn } = await auth()
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  return NextResponse.next()
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};