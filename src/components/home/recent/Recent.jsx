import React from "react"
import Heading from "../../common/Heading"
import "./recent.css"

import RecentCard from "./RecentCard"

const Recent = () => {
  return (
    <>
      <section className='recent padding'>
        <div className='container'>
          <Heading title='Recent Property Listed' subtitle=' Do not wait any longer to book your perfect missionary accommodation. Browse our featured apartments today and experience the best in temporary housing for missionaries.' />
          <RecentCard />
        </div>
      </section>
    </>
  )
}

export default Recent
