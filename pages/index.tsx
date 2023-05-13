import React from "react"
import Layout from "../components/Layout"
import { PostProps } from "../components/Post"

import { useSession } from "next-auth/react";
type Props = {
  feed: PostProps[]
}

const Home: React.FC<Props> = (props) => {
  const {data : session }  = useSession()
  console.log("sessionData", session);
  return (
    <Layout>
      <div className="page">
        <h1>Sago Rewards</h1>
        <main>
          
        </main>
      </div>
    </Layout>
  )
}

export default Home
