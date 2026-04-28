"use server"

import { getInterviewers } from "@/actions"
import ExploreGrid from "@/app/(main)/explore/_components/explore-grid"
import { PageHeader } from "@/components/resubales"

const ExplorePage = async() => {
    const interviewers=await getInterviewers()
    console.log(interviewers)

  return (
    <div className="min-h-screen mt-15">
      <PageHeader 
        smallTitle="Explore" 
        title="Find Interviewers" 
        description="Discover and connect with top interviewers to practice and improve your skills." 
      />

      <div className="px-5 md:px-20">
        <ExploreGrid interviewers={interviewers}/>
      </div>
    </div>
  )
}

export default ExplorePage