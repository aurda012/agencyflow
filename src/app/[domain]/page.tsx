import React from "react";
import { notFound, redirect } from "next/navigation";

import { getDomainContent } from "@/database/actions/funnel.actions";
import { updateFunnelPageVisits } from "@/database/actions/funnel.actions";

import EditorProvider from "@/components/providers/EditorProvider";
import FunnelEditor from "@/components/modules/editor/FunnelEditor";
import { IFunnelPage } from "@/database/models/funnelpage.model";

interface DomainPageProps {
  params: {
    domain: string | undefined;
  };
}

const DomainPage: React.FC<DomainPageProps> = async ({ params }) => {
  const { domain } = params;

  if (!domain) notFound();

  const domainData = await getDomainContent(domain.slice(0, -1));

  if (!domainData) notFound();

  const pageData = domainData.funnelPages.find(
    (page: Partial<IFunnelPage>) => !page.pathName
  );

  if (!pageData) notFound();

  await updateFunnelPageVisits(pageData._id);

  return (
    <EditorProvider
      subAccountId={domainData.subAccountId}
      pageDetails={pageData}
      funnelId={domainData._id}
    >
      <FunnelEditor
        funnelPageId={pageData._id}
        funnelPageDetails={pageData}
        liveMode
      />
    </EditorProvider>
  );
};

export default DomainPage;
