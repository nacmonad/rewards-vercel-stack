import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div className="px-4 py-2">
    <Header />
    <div className="layout">{props.children}</div>
  </div>
);

export default Layout;
