"use client";

import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const PageWrapper = ({ children, className = "" }: PageWrapperProps) => {
  return (
    <main className={`min-h-screen w-full pt-16 ${className}`}>
      <div className="w-full h-full">{children}</div>
    </main>
  );
};

export default PageWrapper;
