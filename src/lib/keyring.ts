import {HDNodeWallet}from "ethers"

export interface DerivedAddress {
  network: Network;
  accountIndex: number;
  address: string;
  privateKey: string;
  publicKey: string;
  path: string;
}
export type Network = "ethereum" | "bitcoin" | "solana" | "linea" | "base" | "bnb" | "polygon" | "optimism" | "arbitrum" | "tron"



export type WalletAccount = {
  accountIndex: number
  label: string
  addresses: Partial<Record<Network, DerivedAddress>>
}

export type Keyring = {
  accounts: WalletAccount[]
  selectedAccountIndex: number
}


export function deriveEthereumWallet(mnemonic: string, accountIndex: number):DerivedAddress {
    const path = `m/44'/60'/0'/0/${accountIndex}`;
    const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    return {
        network: "ethereum",
        accountIndex: accountIndex,
        address: wallet.address,
        privateKey: wallet.privateKey,
        publicKey: wallet.publicKey,
        path: path
    };
}

export function deriveSolanaAddress(){

}

export function deriveBitcoinAddress(){

}

export function deriveWalletAccount(
  mnemonic: string,
  accountIndex: number
): WalletAccount {
  return {
    accountIndex,
    label: `Account ${accountIndex + 1}`,
    addresses: {
      ethereum: deriveEthereumWallet(mnemonic, accountIndex),
    },
  }
}

export function createInitialKeyring(
  mnemonic: string,
  count = 1
): Keyring {
  return {
    selectedAccountIndex: 0,
    accounts: Array.from({ length: count }, (_, i) =>
      deriveWalletAccount(mnemonic, i)
    ),
  }
}