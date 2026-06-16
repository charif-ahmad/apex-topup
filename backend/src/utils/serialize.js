// Convert Prisma Decimal fields to plain numbers for JSON responses.
function toNumber(value) {
  if (value === null || value === undefined) return value;
  return typeof value === 'object' && typeof value.toNumber === 'function'
    ? value.toNumber()
    : Number(value);
}

function serializeWallet(wallet) {
  if (!wallet) return wallet;
  return { ...wallet, balance: toNumber(wallet.balance) };
}

function serializeTransaction(tx) {
  if (!tx) return tx;
  return { ...tx, amount: toNumber(tx.amount) };
}

function serializeService(service) {
  if (!service) return service;
  return { ...service, price: toNumber(service.price) };
}

module.exports = { toNumber, serializeWallet, serializeTransaction, serializeService };
