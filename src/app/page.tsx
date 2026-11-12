import AgentIndexApp from '@/components/AgentIndexApp';
import { parseIndexView } from '@/lib/indexView';
import { getIndexData } from '@/lib/roles/data';

export const dynamic = 'force-dynamic';

type HomeProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { roles } = await getIndexData();
  const initialView = parseIndexView(searchParams ? await searchParams : {});

  return (
    <main className="mx-auto max-w-[1180px] px-4 pt-2 pb-8 sm:px-6 sm:pt-3 sm:pb-8 lg:px-8 lg:pt-4 lg:pb-10">
      <AgentIndexApp roles={roles} initialView={initialView} />
    </main>
  );
}
