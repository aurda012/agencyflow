import React from "react";
import AuthProvider from "@/components/providers/AuthProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default MainLayout;
