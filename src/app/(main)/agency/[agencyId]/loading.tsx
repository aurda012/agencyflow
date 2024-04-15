import React from "react";
import Loading from "@/components/ui/loading";

const AgencyLoading: React.FC = () => {
  return (
    <div className="h-[85vh] flex justify-center items-center">
      <Loading />
    </div>
  );
};

export default AgencyLoading;
