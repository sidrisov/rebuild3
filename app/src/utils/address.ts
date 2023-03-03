export function shortenWalletAddressLabel(walletAddress: string) {
  return walletAddress.slice(0, 5) + '...' + walletAddress.slice(walletAddress.length - 3);
}
