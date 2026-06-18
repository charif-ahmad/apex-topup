import { getWalletAction } from '@/actions/wallet';
import { WalletPageClient } from './WalletPageClient';

export default async function WalletPage() {
  let wallet = null;
  try {
    wallet = await getWalletAction();
  } catch {
    // wallet stays null, client shows 0 balance
  }

  return <WalletPageClient initialBalance={wallet?.balance ?? 0} />;
}
