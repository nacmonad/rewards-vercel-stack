import React from "react";
import Layout from "../../components/Layout";
import { getSession, useSession } from "next-auth/react";
import withAuth from "../../lib/withAuth";
import UsersTable from "../../components/UsersTable";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import prisma from "../../lib/prisma";
import { User } from "@prisma/client";


interface DashboardProps {
  users: User[];
}

const Dashboard: React.FC<DashboardProps> = ( { users }) => {
  const { data: session } = useSession();

  console.log("[Dashboard]", {
    session,
    users
  })
  let dashboardBody;

  if (session?.user?.role === "admin") {
    dashboardBody = <>
      <h2>Welcome, Admin!</h2>
      <UsersTable data={users}/>
    </>;
  } else if (session?.user?.role === "sales") {
    dashboardBody = <h2>Welcome, Salesperson!</h2>;
  } else if (session?.user?.role === "customer") {
    dashboardBody = <h2>Welcome, Customer!</h2>;
  } else {
    dashboardBody = <h2>Welcome to the Dashboard!</h2>;
  }

  return (
    <Layout>
      <div className="page">
        <h1>Dashboard</h1>
        <main>{dashboardBody}</main>
      </div>
    </Layout>
  );
};

export default withAuth(Dashboard);

export const getServerSideProps: GetServerSideProps = async ( context : GetServerSidePropsContext) => {
  try {
    const session = await getSession(context);
    if(!session) return {
      redirect:{
        destination:'/',
        permanent:false
      }
    }
    if(session?.user?.role === "admin") {
      const users = await prisma.user.findMany({
        skip:0,
        take:10,
        select:{
          id: true,
          email: true,
          name: true,
          roleId: true,
          githubId: true,
          googleId: true,
          role: {
            select:{
              name:true
            }
          },
          points: {
            where:{
              currentAmount: {
                gt: 0
              }
            },
            select:{
              id:true,
              currentAmount:true
            }
          }
        }
      });
      console.log("[users]", users)
      return {
        props: { users : users.map(u=>({...u , role:u.role.name })) },
      };
    }
    
    const user = await prisma.user.findUnique({
      where:{
        email:session.user.email
      },
      select:{
        id: true,
        email: true,
        name: true,
        roleId: true,
        githubId: true,
        googleId: true,
        role: {
          select:{
            name:true
          }
        },
        points: {
          where:{
            currentAmount: {
              gt: 0
            }
          },
          select:{
            id:true,
            currentAmount:true
          }
        }
      }
    });
    return {
      props: { users:[{...user, role: user.role.name}] },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: { users: [] },
    };
  } finally {
    await prisma.$disconnect();
  }
};
