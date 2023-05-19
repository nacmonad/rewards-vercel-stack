import React from "react";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import withAuth from "../../lib/withAuth";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();

  let dashboardBody;

  if (session?.user?.role === "admin") {
    dashboardBody = <h2>Welcome, Admin!</h2>;
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
