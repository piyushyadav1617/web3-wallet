export type Network = "ethereum" | "solana" | "bitcoin"

export type DerivedAddress = {
  network: Network
  accountIndex: number
  path: string
  address: string
}

export type WalletAccount = {
  accountIndex: number
  label: string
  addresses: Record<Network, DerivedAddress>
}

export type KeyringState = {
  accounts: WalletAccount[]
  selectedAccountIndex: number
}

type DeriveParams = {
  mnemonic: string
  accountIndex: number
}

// deriveWalletAccount(mnemonic, 0)
// -> {
//   accountIndex: 0,
//   label: "Account 1",
//   addresses: {
//     ethereum: ...,
//     solana: ...,
//     bitcoin: ...
//   }
// }

function deriveWalletAccount(mnemonic:string, accountIndex: number){
   return
}

// const accounts = [0, 1, 2].map(i => deriveWalletAccount(mnemonic, i))

// session.keyring.accounts


// mnemonic
// -> seed
// -> master key
// -> child keys by derivation path
// -> addresses


// same mnemonic + different path = different account/address

// child_key = Derive(parent_key, index)

// master
// -> 44'
// -> 60'
// -> 0'
// -> 0
// -> 2


const keyring: KeyringState = {
  selectedAccountIndex: 0,
  accounts: [
    {
      accountIndex: 0,
      label: "Account 1",
      addresses: {
        ethereum: {
          network: "ethereum",
          accountIndex: 0,
          path: "m/44'/60'/0'/0/0",
          address: "0x1234..."
        },
        solana: {
          network: "solana",
          accountIndex: 0,
          path: "m/44'/501'/0'/0'",
          address: "7abc..."
        },
        bitcoin: {
          network: "bitcoin",
          accountIndex: 0,
          path: "m/44'/0'/0'/0/0",
          address: "1abc..."
        }
      }
    }
  ]
}