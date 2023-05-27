import { getSession, useSession } from "next-auth/react"
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import Layout from "../../components/Layout";

const Claim =  ( { code }) => {
    const { data : session } = useSession();
    console.log("[Claim]" ,{
      session,
      code
    })
    return (
        <Layout>
            <main>
                Claim Page Goes Here
            </main>
        </Layout>
    )
}

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