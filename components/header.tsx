"use server"
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import { ModeToggle } from './theme-mode-toggle'
import Link from 'next/link'
import { Calendar, Coins, Users } from 'lucide-react'
import { checkUser } from '@/lib/auth/checkUser'
import { CreditButton } from '@/components/credit-button'
import RoleRedirect from './RoleRedirect'

const Header = async () => {
  const user = await checkUser()
  console.log(user)
  return (
    <div className='fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-10 py-3 border-b border-white/7 backdrop-blur-xl'>
      {/* logo */}
      <Link href={"/"}>
        <h2 className='font-semibold text-xl text-foreground'>Mocktail</h2>
      </Link>

      {user && <RoleRedirect role={user.role}/>}


      <div className="flex items-center gap-6">
        <ModeToggle /> <div className="flex items-center gap-3">
          <Show when={"signed-out"}>
            <SignInButton >
              <Button variant={"outline"} className='border-0  bg-amber-500 hover:bg-amber-600 cursor-pointer transition-colors'>Sign in</Button>
            </SignInButton>
            <SignUpButton >
              <Button className='bg-amber-500 text-accent hover:bg-amber-600 transition-colors cursor-pointer'>Get started</Button>
            </SignUpButton>
          </Show>
          <Show when={"signed-in"}>
            <div className="flex -items-center gap-3 items-center">
              {
                user?.role === "INTERVIEWER" && (
                  <Button variant={"ghost"} className='text-amber-500 rounded-sm hover:text-amber-600'>
                    <Link href={"/dashboard"}>
                      Dashboard
                    </Link>
                  </Button>
                )
              }

              {
                user?.role === "INTERVIEWEE" && (
                  <>
                    <Button variant={"outline"} className='flex items-center gap-2'>
                      <Link href={"/explore"} className='flex items-center gap-2'>
                        <Users className=' h-4 w-4' />
                        <span className='hidden md:inline'>Explore</span>
                      </Link>
                    </Button>

                    <Button variant={"default"} className='flex items-center gap-2'>
                      <Link href={"/appointments"} className='flex items-center gap-2'>
                        <Calendar className=' h-4 w-4' />
                        <span className='hidden md:inline'>Appointments</span>
                      </Link>
                    </Button>
                  </>
                )
              }

              {user && <CreditButton credits={user.credits || 0} isInterviewer={user.role === "INTERVIEWER"} />}
              <UserButton />
            </div>

          </Show>

        </div>
      </div>
    </div>
  )
}

export default Header