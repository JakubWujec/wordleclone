import * as React from 'react';

type ContentLayoutProps = {
  children: React.ReactNode;
};

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <>
      <div className="py-6">
        <div className="max-w-lg mx-auto">{children}</div>
      </div>
    </>
  );
};