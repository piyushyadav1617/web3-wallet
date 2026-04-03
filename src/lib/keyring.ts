import {HDNodeWallet}from "ethers"
// unlock page
// ├─ decrypt vault -> mnemonic
// ├─ load public wallet metadata cache
// ├─ if cache exists
// │  ├─ hydrate keyring from cache
// │  └─ store mnemonic + keyring in session
// └─ if cache missing
//    ├─ derive initial accounts (e.g. 0..2)
//    ├─ store mnemonic + keyring in session
//    └─ persist public metadata cache

export interface WalletKeys {
  network: "etherium" | "solana" | "bitcoin";
  address: string;
  privateKey: string;
  publicKey: string;
  path: string;
}

export function deriveEthereumWallet(mnemonic: string, index: number):WalletKeys {
    const path = `m/44'/60'/0'/0/${index}`;
    const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    return {
        network: "etherium",
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

export function deriveWalletAccount(){

}