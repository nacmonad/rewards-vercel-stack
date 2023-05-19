import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const withAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "authenticated" && !session) {
        router.replace("/"); // Redirect to home page
      }
    }, [status, session, router]);

    if (status === "loading") {
      return <div>Loading...</div>; // Optional: Show a loading state or message
    }

    return session ? <WrappedComponent {...props} /> : null;
  };

  return withAuth;
};

export default withAuth;
