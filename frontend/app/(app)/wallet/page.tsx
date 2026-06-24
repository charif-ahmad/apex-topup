import { getWalletAction } from '@/actions/wallet';
import { listTransactionsAction } from '@/actions/transactions';
import { WalletPageClient } from './WalletPageClient';

type SearchParams = { [key: string]: string | string[] | undefined };

export default async function WalletPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const pageParam = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const page = Math.max(1, Number(pageParam) || 1);

  const [balance, transactions] = await Promise.all([
    getWalletAction().catch(() => 0),
    listTransactionsAction({ page, limit: 10 }),
  ]);

  return (
    <WalletPageClient
      initialBalance={balance}
      transactions={transactions.items}
      page={page}
      totalPages={transactions.totalPages}
    />
  );
}
