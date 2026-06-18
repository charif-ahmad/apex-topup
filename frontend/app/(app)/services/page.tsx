import { listServicesAction } from '@/actions/services';
import { getWalletAction } from '@/actions/wallet';
import { ServicesClient } from './ServicesClient';

export default async function ServicesPage() {
  const [svcResult, walletResult] = await Promise.allSettled([
    listServicesAction(),
    getWalletAction(),
  ]);

  const services = svcResult.status === 'fulfilled' ? svcResult.value : [];
  const walletBalance = walletResult.status === 'fulfilled' ? walletResult.value.balance : 0;

  return <ServicesClient initialServices={services} walletBalance={walletBalance} />;
}
