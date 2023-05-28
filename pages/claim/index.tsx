import {useEffect, useState} from "react";
import { getSession, useSession } from "next-auth/react"
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

const Claim = ({ code }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [point, setPoint] = useState(null);

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);
    
    console.log("[handleClaim]", {
      session,
      code
    })
    try {
      const response = await fetch("/api/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          code,
        }),
      });     
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message); // Throw an error if the claim request is not successful
      }
      const res = await response.json();
      setSuccess(true);
      setPoint(res.point);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
      setTimeout(()=>router.replace('/dashboard'), 2500)
      //router.replace('/')
    }
  };

  useEffect(() => {
    if (code && session) {
      handleClaim();
    }
  }, [code, session]);

  return (
    <Layout>
      <main>
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {success && <p>Claim successful!</p>}
        {point && <p>{JSON.stringify(point)}</p>}
      </main>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ( context : GetServerSidePropsContext) => {
    try {
      const session = await getSession(context);
      const queryParams = context.query;
      const code = queryParams['code'];
      if(!code) return {
          redirect:{
            destination:`/`,
            permanent:false
          }
        } 
      if(!session) {
        const callbackUrl = code ? `/claim?code=${queryParams['code']}` : `/`;
        
        return {
            redirect:{
                destination:`/api/auth/signin?callbackUrl=${callbackUrl}`,
                permanent:false
            }
      }}

      return {
        props: { 
          code
         },
      };
    } catch (error) {
      console.error("Error", error);
      return {
        props: {  },
      };
    } 
  };

export default Claim;