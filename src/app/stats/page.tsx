import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const StatsPage = async () => {
    const {userId} = await auth();

    if (!userId) {
        redirect('/');
    }
  return (
    <div>StatsPage</div>
  )
}

export default StatsPage