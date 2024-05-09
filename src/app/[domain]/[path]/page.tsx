import React from "react";
import { notFound } from "next/navigation";

import { getDomainContent } from "@/database/actions/funnel.actions";
import EditorProvider from "@/components/providers/EditorProvider";
import FunnelEditor from "@/components/modules/editor/FunnelEditor";
import { IFunnelPage } from "@/database/models/funnelpage.model";

interface DomainPathPageProps {
  params: {
    domain: string | undefined;
    path: string | undefined;
  };
}

const DomainPathPage: React.FC<DomainPathPageProps> = async ({ params }) => {
  const { domain, path } = params;

  if (!domain || !path) notFound();

  const domainData = await getDomainContent(domain.slice(0, -1));
  const pageData = domainData?.funnelPages.find(
    (page: Partial<IFunnelPage>) => page.pathName === params.path
  );

  if (!pageData || !domainData) notFound();

  return (
    <EditorProvider
      subAccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData._id}
    >
      <FunnelEditor
        funnelPageDetails={pageData}
        funnelPageId={pageData._id}
        liveMode
      />
    </EditorProvider>
  );
};

export default DomainPathPage;
