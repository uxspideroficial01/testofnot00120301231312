import { Workspace } from "@/features/workspace/workspace";
import { parseWorkspaceParams } from "@/features/workspace/route-params";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const workspace = parseWorkspaceParams(params);
  return <Workspace key={workspace.payDemoScenario} {...workspace} />;
}
