import { HDNodeWallet } from "ethers"
import { HDKey } from "micro-ed25519-hdkey";
import { HDKey as BitcoinHDKey } from "@scure/bip32"
import { mnemonicToSeedSync } from "@scure/bip39";
import { createKeyPairSignerFromPrivateKeyBytes } from "@solana/kit";
import * as bitcoin from "bitcoinjs-lib";

export interface DerivedAddress {
    network: Network;
    accountIndex: number;
    address: string;
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

export type KeyringMeta = {
    selectedAccountIndex: number
    accounts: {
        accountIndex: number
        label: string
    }[]
}


export function deriveEthereumWallet(mnemonic: string, accountIndex: number): DerivedAddress {
    const path = `m/44'/60'/0'/0/${accountIndex}`;
    const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
    return {
        network: "ethereum",
        accountIndex: accountIndex,
        address: wallet.address,
        path: path
    };
}

export async function deriveSolanaAddress(mnemonic: string, accountIndex: number): Promise<DerivedAddress> {
    const seed = mnemonicToSeedSync(mnemonic);
    const hd = HDKey.fromMasterSeed(seed);
    const path = `m/44'/501'/${accountIndex}'/0'`;
    const child = hd.derive(path);
    const signer = await createKeyPairSignerFromPrivateKeyBytes(child.privateKey);
    return {
        network: "solana",
        accountIndex: accountIndex,
        address: signer.address,
        path: path
    }
}

export function deriveBitcoinAddress(mnemonic: string, accountIndex: number): DerivedAddress {
    const seed = mnemonicToSeedSync(mnemonic)
    const hd = BitcoinHDKey.fromMasterSeed(seed);
    const path = `m/44'/0'/0'/0/${accountIndex}`;
    const child = hd.derive(path)
    if (!child.publicKey) {
        throw new Error("Failed to derive Bitcoin public key");
    }
    const { address } = bitcoin.payments.p2pkh({
        pubkey: child.publicKey
    });
    if (!address) {
        throw new Error("Failed to derive Bitcoin address");
    }
    return {
        network: "bitcoin",
        accountIndex,
        address: address,
        path,
    };
}

export async function deriveWalletAccount(
    mnemonic: string,
    accountIndex: number,
    label?: string
): Promise<WalletAccount> {
    const ethereum = deriveEthereumWallet(mnemonic, accountIndex)
    const bitcoin = deriveBitcoinAddress(mnemonic, accountIndex)
    const solana = await deriveSolanaAddress(mnemonic, accountIndex)
    return {
        accountIndex,
        label: label ?? `Account ${accountIndex + 1}`,
        addresses: {
            ethereum: ethereum,
            solana: solana,
            bitcoin: bitcoin
        },
    }
}

export async function createInitialKeyring(
    mnemonic: string,
    keyringMeta: KeyringMeta
): Promise<Keyring> {
    const accountsResult = await Promise.allSettled(
        keyringMeta.accounts.map(acc => {
            return deriveWalletAccount(mnemonic, acc.accountIndex, acc.label)
        })
    )
    const accounts = accountsResult.map((res) => {
        if (res.status === "fulfilled") {
            return res.value
        } else {
            return null
        }
    }).filter(a => a != null)

    if (accounts.length === 0) {
        throw new Error("Failed to derive any wallet accounts")
    }
    return {
        selectedAccountIndex: accounts.some(
            (a) => a.accountIndex === keyringMeta.selectedAccountIndex
        )
            ? keyringMeta.selectedAccountIndex
            : accounts[0].accountIndex,
        accounts: accounts,
    }
}

export function getNextAccountIndex(keyring: Keyring): number {
    if (keyring.accounts.length === 0) return 0

    return Math.max(...keyring.accounts.map(a => a.accountIndex)) + 1
}

export async function addNewAccount(
    mnemonic: string,
    keyring: Keyring
): Promise<Keyring> {
    const nextIndex = getNextAccountIndex(keyring)

    const newAccount = await deriveWalletAccount(mnemonic, nextIndex)

    return {
        ...keyring,
        accounts: [...keyring.accounts, newAccount],
        selectedAccountIndex: newAccount.accountIndex,
    }
}

export function keyringToMeta(keyring: Keyring): KeyringMeta {
  return {
    selectedAccountIndex: keyring.selectedAccountIndex,
    accounts: keyring.accounts.map((account) => ({
      accountIndex: account.accountIndex,
      label: account.label,
    })),
  }
}