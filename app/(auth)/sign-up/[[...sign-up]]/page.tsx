import { SignUp } from '@clerk/nextjs'

const page = () => {
  return <div className='flex items-center justify-center py-36'>
    <SignUp/>
  </div>
}

export default page