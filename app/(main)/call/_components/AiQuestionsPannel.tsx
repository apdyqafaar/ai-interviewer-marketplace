'use client'
import { generateQuestions } from "@/actions/aiQuestions"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CATEGORY_LABEL } from "@/lib"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"


const AiQuestionsPannel = () => {
    const categories=[
        "FRONTEND",
        "SYSTEM_DESIGN",
        "DATA_SCIENCE",
        "MOBILE",
        "DEVOPS",
        "AI_AND_ML",
        "BACKEND",
        "FULLSTACK",
        "HR",
    ]

   const [loading,setLoading] = useState(false)
   const [difficulty,setDifficulty] = useState("medium")
   const [category,setCategory] = useState("FRONTEND")
   const[questions,setQuestions]=useState<{question:string,answer:string}[]>([])

   const handleGenerateQuestions=async()=>{
    if(loading || !category||!difficulty)return toast.error("Please select a category and difficulty")

    try {
        setLoading(true)
        const data=await generateQuestions(category,difficulty) as any
        // 
        if(data.questions.length>0){
            console.log("data",data.questions)
          setQuestions(data.questions as any)
        }
    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
   }

    return (

        <div className="flex flex-col">
                <div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {/* cetegory */}
                    {
                      categories.map((cat) => {
                        return <Button
                        onClick={() => {
                          setCategory(cat)
                        }}
                        className={`${category===cat?"bg-amber-500/10  hover:bg-amber-500/20":"text-amber-400 "}hover:text-amber-500`}
                          key={cat}
                          size="sm"
                          variant="outline"
                        >
                          {CATEGORY_LABEL[cat as keyof typeof CATEGORY_LABEL]}
                        </Button>
                      })
                    }
                  </div>
                  {/* shadcn selector of difficult, easy, hard, normal  and generate button */}
                  <div className="flex gap-2 my-4">
                    {/* difficulty selector */}
                    <Select
                      value={difficulty}
                      onValueChange={setDifficulty}
                    >
                      <SelectTrigger className="px-3 rounded-sm">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    {/* generate button */}
                    <Button disabled={loading} onClick={handleGenerateQuestions}   className="text-amber-400 hover:text-amber-500 border border-amber-500/30 bg-amber-500/10 hover:border-amber-500 hover:bg-amber-500/20 px-6 py-4 rounded-sm cursor-pointer">
                      <>
                      <Sparkles  className="w-4 h-4 mr-2" />
                      {loading ? "Generating..." : "Generate"}
                      </>
                    </Button>
                  </div>
                  
                </div>
                <Separator/>
                <div className="mt-6 flex flex-col gap-4 overflow-y-auto max-h-[60vh] pr-2">
                  {questions.length === 0 && !loading && (
                    <div className="text-center text-muted-foreground py-8">
                      No questions generated yet. Select a category and click generate.
                    </div>
                  )}
                  {loading && (
                    <div className="text-center text-muted-foreground py-8 animate-pulse">
                      Generating questions...
                    </div>
                  )}
                  {questions.length > 0 && !loading && questions.map((q, index) => (
                    <div key={index} className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base mb-2 text-neutral-900 dark:text-neutral-100">{q.question}</h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{q.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    )
}

export default AiQuestionsPannel