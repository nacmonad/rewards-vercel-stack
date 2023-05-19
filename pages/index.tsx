import React from "react";
import Layout from "../components/Layout";
import { PostProps } from "../components/Post";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

type Props = {
  feed: PostProps[];
};

const Home: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  const router = useRouter();

  // React.useEffect(() => {
  //   // Redirect to dashboard if user session exists
  //   if (session) {
  //     router.replace("/dashboard");
  //   }
  // }, [session, router]);

  return (
    <Layout>
      <div className="page">
        <h1>Sago Rewards</h1>
        <main>{/* Add your content here */}</main>
      </div>
    </Layout>
  );
};

export default Home;
