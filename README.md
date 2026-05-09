Here’s a concise README focused on what you’ve built:


# HD Multi-Chain Wallet (Web)

A browser-based HD wallet supporting deterministic multi-account and multi-chain address generation with encrypted vault storage and IndexedDB persistence.


## Features

### Wallet Core

* BIP39 mnemonic-based wallet
* Deterministic HD account derivation
* Multiple accounts (`Account 1`, `Account 2`, …)
* Add new accounts dynamically
* Account switching


### Supported Networks

* Ethereum (and EVM chains: Base, Optimism, Arbitrum, Polygon, BNB, Linea)
* Solana
* Bitcoin


### Security

* Mnemonic encrypted using:

  * PBKDF2 (SHA-256)
  * AES-GCM (256-bit)
* Stored in IndexedDB
* Decrypted only in-memory during session
* No private keys persisted


### Persistence Model

Stored in IndexedDB:

* **Vault (encrypted mnemonic)**
* **Keyring Meta (public only)**

  ```ts
  {
    selectedAccountIndex,
    accounts: [{ accountIndex, label }]
  }
  ```

Derived at runtime:

* All addresses (from mnemonic + index)


### Session

* In-memory session store
* Stores:

  * decrypted mnemonic
  * derived keyring
* Supports:

  * unlock / lock
  * addAccount
  * switch account


### Account Flow

**Unlock**

```
vault → decrypt → load meta → derive accounts → session
```

**Add Account**

```
nextIndex → derive → update keyring → persist meta
```

**Switch Account**

```
update selectedAccountIndex → persist meta
```

## Tech Stack

* React + TypeScript
* Web Crypto API
* IndexedDB
* ethers.js (Ethereum)
* micro-ed25519-hdkey (Solana)
* @scure/bip39, @scure/bip32
* bitcoinjs-lib


## Notes

* Addresses are not stored, only derived
* EVM chains reuse Ethereum address
* Bitcoin uses legacy P2PKH


## Currently working on

* SegWit Bitcoin (BIP84)
* Token balances (ERC20/SPL)
* Transaction signing
* Network RPC integration


This project focuses on correct HD wallet architecture, deterministic derivation, and clean state management.
