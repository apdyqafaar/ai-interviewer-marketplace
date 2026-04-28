import { SignIn } from '@clerk/nextjs'

const page = () => {
  return <div className='flex items-center justify-center py-36'>
    <SignIn />
    <div>

    </div>
  </div>
}

export default page