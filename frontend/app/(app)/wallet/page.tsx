import { getWalletAction } from '@/actions/wallet';
import { WalletPageClient } from './WalletPageClient';

export default async function WalletPage() {
  let balance = 0;
  try {
    balance = await getWalletAction();
  } catch {
    // stays 0
  }

  return <WalletPageClient initialBalance={balance} />;
}
