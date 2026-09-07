/**
 * Pure TypeScript implementations for Classical Ciphers, Blowfish, and RSA KeyPair simulation.
 */

// Helper functions for UTF-8 encoding/decoding without relying on DOM/Node globals
function stringToUtf8Bytes(str: string): Uint8Array {
  const utf8: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
    } else {
      i++;
      charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f)
      );
    }
  }
  return new Uint8Array(utf8);
}

function utf8BytesToString(bytes: Uint8Array): string {
  let out = '';
  let i = 0;
  while (i < bytes.length) {
    const c = bytes[i++];
    if (c < 128) {
      out += String.fromCharCode(c);
    } else if (c > 191 && c < 224) {
      const c2 = bytes[i++];
      out += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
    } else if (c > 223 && c < 240) {
      const c2 = bytes[i++];
      const c3 = bytes[i++];
      out += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
    } else {
      const c2 = bytes[i++];
      const c3 = bytes[i++];
      const c4 = bytes[i++];
      const u = (((c & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63)) - 0x10000;
      out += String.fromCharCode(0xd800 + (u >> 10), 0xdc00 + (u & 0x3ff));
    }
  }
  return out;
}

// --- CAESAR CIPHER ---
export function caesarEncrypt(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + s) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + s) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export function caesarDecrypt(text: string, shift: number): string {
  return caesarEncrypt(text, -shift);
}

// --- ROT13 ---
export function rot13(text: string): string {
  return caesarEncrypt(text, 13);
}

// --- VIGENÈRE CIPHER ---
export function vigenereEncrypt(text: string, key: string): string {
  if (!key) return text;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return text;

  let keyIndex = 0;
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;

      if (code >= 65 && code <= 90) {
        keyIndex++;
        return String.fromCharCode(((code - 65 + shift) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        keyIndex++;
        return String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

export function vigenereDecrypt(text: string, key: string): string {
  if (!key) return text;
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  if (!cleanKey) return text;

  let keyIndex = 0;
  return text
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;

      if (code >= 65 && code <= 90) {
        keyIndex++;
        return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
      }
      if (code >= 97 && code <= 122) {
        keyIndex++;
        return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
      }
      return char;
    })
    .join('');
}

// --- RAIL FENCE CIPHER ---
export function railFenceEncrypt(text: string, rails: number): string {
  if (rails <= 1 || !text) return text;

  const fence: string[][] = Array.from({ length: rails }, () => []);
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < text.length; i++) {
    fence[rail].push(text[i]);
    rail += direction;
    if (rail === 0 || rail === rails - 1) {
      direction *= -1;
    }
  }

  return fence.map(row => row.join('')).join('');
}

export function railFenceDecrypt(ciphertext: string, rails: number): string {
  if (rails <= 1 || !ciphertext) return ciphertext;

  const markFence: boolean[][] = Array.from({ length: rails }, () =>
    Array(ciphertext.length).fill(false)
  );
  let rail = 0;
  let direction = 1;

  for (let i = 0; i < ciphertext.length; i++) {
    markFence[rail][i] = true;
    rail += direction;
    if (rail === 0 || rail === rails - 1) {
      direction *= -1;
    }
  }

  const fence: string[][] = Array.from({ length: rails }, () =>
    Array(ciphertext.length).fill('')
  );
  let index = 0;
  for (let r = 0; r < rails; r++) {
    for (let c = 0; c < ciphertext.length; c++) {
      if (markFence[r][c] && index < ciphertext.length) {
        fence[r][c] = ciphertext[index++];
      }
    }
  }

  let result = '';
  rail = 0;
  direction = 1;
  for (let i = 0; i < ciphertext.length; i++) {
    result += fence[rail][i];
    rail += direction;
    if (rail === 0 || rail === rails - 1) {
      direction *= -1;
    }
  }

  return result;
}

// --- PURE JS BLOWFISH SIMULATION ---
export function blowfishEncrypt(text: string, key: string): string {
  if (!text) return '';
  const safeKey = key || 'default-secret-key';
  let keySum = 0;
  for (let i = 0; i < safeKey.length; i++) {
    keySum = (keySum + safeKey.charCodeAt(i) * (i + 1)) % 256;
  }
  if (keySum === 0) keySum = 127;

  const bytes = stringToUtf8Bytes(text);
  const encrypted = new Uint8Array(bytes.length);

  for (let i = 0; i < bytes.length; i++) {
    let b = bytes[i];
    const kChar = safeKey.charCodeAt(i % safeKey.length);
    for (let round = 0; round < 4; round++) {
      b ^= (kChar + round * keySum) & 0xff;
      b = ((b << 3) | (b >> 5)) & 0xff;
    }
    encrypted[i] = b;
  }

  return Array.from(encrypted)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function blowfishDecrypt(hex: string, key: string): string {
  if (!hex) return '';
  const safeKey = key || 'default-secret-key';
  let keySum = 0;
  for (let i = 0; i < safeKey.length; i++) {
    keySum = (keySum + safeKey.charCodeAt(i) * (i + 1)) % 256;
  }
  if (keySum === 0) keySum = 127;

  try {
    const cleanHex = hex.trim().replace(/[^0-9a-fA-F]/g, '');
    if (cleanHex.length % 2 !== 0) return '[Invalid Hex Ciphertext]';

    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
    }

    const decrypted = new Uint8Array(bytes.length);

    for (let i = 0; i < bytes.length; i++) {
      let b = bytes[i];
      const kChar = safeKey.charCodeAt(i % safeKey.length);
      for (let round = 3; round >= 0; round--) {
        b = ((b >> 3) | (b << 5)) & 0xff;
        b ^= (kChar + round * keySum) & 0xff;
      }
      decrypted[i] = b;
    }

    return utf8BytesToString(decrypted);
  } catch (err) {
    return '[Decryption Error: Invalid Ciphertext or Key]';
  }
}

// --- RSA KEYPAIR GENERATION & MATHEMATICAL ENCRYPTION ---

export interface RSAKeyPair {
  publicKey: { n: string; e: string };
  privateKey: { n: string; d: string };
  primes: { p: string; q: string; phi: string };
  formattedPublic: string;
  formattedPrivate: string;
}

function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let res = 1n;
  base = base % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= 2n;
  }
  return res;
}

function modInverse(a: bigint, m: bigint): bigint {
  let m0 = m;
  let y = 0n, x = 1n;
  if (m === 1n) return 0n;

  let a0 = a;
  while (a0 > 1n) {
    if (m0 === 0n) break;
    const q = a0 / m0;
    let t = m0;
    m0 = a0 % m0;
    a0 = t;
    t = y;
    y = x - q * y;
    x = t;
  }
  if (x < 0n) x += m;
  return x;
}

const PRIMES = [
  61n, 53n, 157n, 173n, 197n, 211n, 227n, 239n, 251n, 269n,
  281n, 293n, 311n, 337n, 349n, 367n, 379n, 397n, 409n, 421n
];

export function generateRSAKeyPair(): RSAKeyPair {
  const idx1 = Math.floor(Math.random() * PRIMES.length);
  let idx2 = Math.floor(Math.random() * PRIMES.length);
  while (idx1 === idx2) {
    idx2 = Math.floor(Math.random() * PRIMES.length);
  }

  const p = PRIMES[idx1];
  const q = PRIMES[idx2];
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);

  const eCandidates = [65537n, 17n, 7n, 3n];
  let e = 17n;
  for (const cand of eCandidates) {
    if (cand < phi && phi % cand !== 0n) {
      e = cand;
      break;
    }
  }

  const d = modInverse(e, phi);

  const formattedPublic = `-----BEGIN PUBLIC KEY-----\nModulus (n): ${n.toString()}\nExponent (e): ${e.toString()}\n-----END PUBLIC KEY-----`;
  const formattedPrivate = `-----BEGIN RSA PRIVATE KEY-----\nModulus (n): ${n.toString()}\nPrivate Exponent (d): ${d.toString()}\n-----END RSA PRIVATE KEY-----`;

  return {
    publicKey: { n: n.toString(), e: e.toString() },
    privateKey: { n: n.toString(), d: d.toString() },
    primes: { p: p.toString(), q: q.toString(), phi: phi.toString() },
    formattedPublic,
    formattedPrivate,
  };
}

export function rsaEncrypt(text: string, publicKeyJsonOrString: string): string {
  if (!text) return '';
  try {
    let n = 3233n;
    let e = 17n;

    if (publicKeyJsonOrString.includes('{')) {
      const parsed = JSON.parse(publicKeyJsonOrString);
      n = BigInt(parsed.n || parsed.modulus);
      e = BigInt(parsed.e || parsed.exponent);
    } else {
      const nMatch = publicKeyJsonOrString.match(/Modulus \(n\):\s*(\d+)/i) || publicKeyJsonOrString.match(/n\s*[:=]\s*(\d+)/i);
      const eMatch = publicKeyJsonOrString.match(/Exponent \(e\):\s*(\d+)/i) || publicKeyJsonOrString.match(/e\s*[:=]\s*(\d+)/i);
      if (nMatch) n = BigInt(nMatch[1]);
      if (eMatch) e = BigInt(eMatch[1]);
    }

    const encryptedBlocks: string[] = [];
    for (let i = 0; i < text.length; i++) {
      const m = BigInt(text.charCodeAt(i));
      const c = modPow(m, e, n);
      encryptedBlocks.push(c.toString());
    }

    return encryptedBlocks.join('-');
  } catch (err) {
    return '[RSA Encryption Error: Invalid Public Key format]';
  }
}

export function rsaDecrypt(ciphertext: string, privateKeyJsonOrString: string): string {
  if (!ciphertext) return '';
  try {
    let n = 3233n;
    let d = 2753n;

    if (privateKeyJsonOrString.includes('{')) {
      const parsed = JSON.parse(privateKeyJsonOrString);
      n = BigInt(parsed.n || parsed.modulus);
      d = BigInt(parsed.d || parsed.privateExponent);
    } else {
      const nMatch = privateKeyJsonOrString.match(/Modulus \(n\):\s*(\d+)/i) || privateKeyJsonOrString.match(/n\s*[:=]\s*(\d+)/i);
      const dMatch = privateKeyJsonOrString.match(/Private Exponent \(d\):\s*(\d+)/i) || privateKeyJsonOrString.match(/d\s*[:=]\s*(\d+)/i);
      if (nMatch) n = BigInt(nMatch[1]);
      if (dMatch) d = BigInt(dMatch[1]);
    }

    const blocks = ciphertext.trim().split('-');
    let result = '';
    for (const b of blocks) {
      if (!b) continue;
      const c = BigInt(b);
      const m = modPow(c, d, n);
      result += String.fromCharCode(Number(m));
    }

    return result;
  } catch (err) {
    return '[RSA Decryption Error: Invalid Ciphertext or Private Key]';
  }
}
