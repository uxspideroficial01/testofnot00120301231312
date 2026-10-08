import { Workspace } from "@/components/workspace";
import { parseWorkspaceParams } from "@/features/workspace/route-params";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <Workspace {...parseWorkspaceParams(params)} />;
}
