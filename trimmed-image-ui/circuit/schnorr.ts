import * as crypto from 'crypto';
import * as elliptic from 'elliptic';
import { Buffer } from 'buffer';

const EC = elliptic.ec;
const ec = new EC('secp256k1'); // Use secp256k1 curve

// Function to compute SHA-256 hash of the message
function hashMessage(message: Buffer): Buffer {
    return crypto.createHash('sha256').update(message).digest();
}

// Function to sign a message
function signMessage(message: string, privKeyHex: string): { R: string, s: string } {
    // Convert the private key from hex string to a BigInt
    const privKey = BigInt('0x' + privKeyHex);
    const key = ec.keyFromPrivate(privKeyHex);

    // Hash the message
    const msgHash = hashMessage(Buffer.from(message)).toString('hex');

    // Generate a random nonce
    let k: BigInt;
    do {
        k = BigInt('0x' + ec.genKeyPair().getPrivate().toString('hex'));
    } while (k === BigInt(0));

    const r = ec.g.mul(k).getX().toString('hex'); // r = k * G (mod p)

    // Compute the challenge
    const R = ec.keyFromPrivate(k).getPublic().encode('hex');
    const e = BigInt('0x' + hashMessage(Buffer.from(R + msgHash, 'hex')).toString('hex'));
    const s = (k - (e * privKey)) % BigInt(ec.curve.n);

    return {
        R: R,
        s: s.toString(16)
    };
}

// Example usage
const privKeyHex = 'your-private-key-in-hex'; // Replace with your actual private key in hex
const message = 'your-message'; // Replace with your actual message

const signature = signMessage(message, privKeyHex);
console.log('Signature:', signature);