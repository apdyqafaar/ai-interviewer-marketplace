import { Loader2, Sparkles } from "lucide-react"


const Loading = () => {
  return (
     <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="flex justify-center animate-pulse">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Initializing Call...</h2>
                        <p className="text-muted-foreground">
                            Please wait while we connect you to the interview.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground mt-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting...
                    </div>
                </div>
            </div>
  )
}

export default Loading