"use server"
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const layout = async ({ children }: {
    children: React.ReactNode
}) => {
    const user = await currentUser()
    if (!user) {
        return redirect("/sign-in")
    }
    return (
        <div className='  mt-10'>{children}</div>
    )
}

export default layout