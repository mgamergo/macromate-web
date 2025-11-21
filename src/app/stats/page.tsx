import RedirectButton from '@/components/common/RedirectButton';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const StatsPage = async () => {
    const {userId} = await auth();

    if (!userId) {
        redirect('/');
    }
  return (
    <div className='flex flex-col items-start'>
      StatsPage
      <RedirectButton redirectTo="/" title="Go to Home" variant='secondary' />
    </div>
  )
}

export default StatsPage