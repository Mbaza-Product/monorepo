import React from 'react';

const RightSidePopup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="p-8 rounded-t-[30px] bg-gray-200 flex flex-col fixed z-40 right-0 top-0 lg:top-auto lg:translate-x-0 transform h-screen max-w-full w-96 2xl:!w-96 shrink-0 dark:bg-gray-950 transition-all duration-200 ease-in-out overflow-y-auto">
      {children}
    </div>
  );
};

export default RightSidePopup;
