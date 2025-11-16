import RedirectButton from '@/components/common/RedirectButton'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = () => {
  return (
    <>
      <div>Homev Page</div>
      <RedirectButton titile="Go to Stats" redirectTo="/stats" variant='secondary' />
    </>
  )
}

export default Home