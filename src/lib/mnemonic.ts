import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';

export function generateNewMnemonic():string{
    const mn = bip39.generateMnemonic(wordlist, 128);
    return mn
}