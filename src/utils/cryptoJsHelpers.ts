// Polyfill crypto.getRandomValues for React Native (Hermes / JSC)
const g: any = typeof globalThis !== 'undefined' ? globalThis : {};

if (typeof g.crypto !== 'object') {
  g.crypto = {};
}
if (typeof g.crypto.getRandomValues !== 'function') {
  g.crypto.getRandomValues = function <T extends ArrayBufferView | null>(array: T): T {
    if (array && 'length' in array) {
      const uint8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
      for (let i = 0; i < uint8.length; i++) {
        uint8[i] = Math.floor(Math.random() * 256);
      }
    }
    return array;
  };
}

import CryptoJS from 'crypto-js';

// Fallback override for WordArray.random to guarantee no crash in RN environments
try {
  if (CryptoJS && CryptoJS.lib && CryptoJS.lib.WordArray) {
    CryptoJS.lib.WordArray.random = function (nBytes: number) {
      const words: number[] = [];
      for (let i = 0; i < nBytes; i += 4) {
        words.push((Math.random() * 0x100000000) | 0);
      }
      return CryptoJS.lib.WordArray.create(words, nBytes);
    };
  }
} catch (e) {
  // ignore fallback assignment error
}

// --- AES-256 ---
export function aesEncrypt(text: string, key: string): string {
  if (!text) return '';
  const secret = key || 'default-secret-key';
  return CryptoJS.AES.encrypt(text, secret).toString();
}

export function aesDecrypt(ciphertext: string, key: string): string {
  if (!ciphertext) return '';
  const secret = key || 'default-secret-key';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) return '[Decryption Failed: Invalid Key or Ciphertext]';
    return originalText;
  } catch (err) {
    return '[Decryption Error: Malformed Ciphertext]';
  }
}

// --- DES ---
export function desEncrypt(text: string, key: string): string {
  if (!text) return '';
  const secret = key || 'default-secret-key';
  return CryptoJS.DES.encrypt(text, secret).toString();
}

export function desDecrypt(ciphertext: string, key: string): string {
  if (!ciphertext) return '';
  const secret = key || 'default-secret-key';
  try {
    const bytes = CryptoJS.DES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) return '[Decryption Failed: Invalid Key or Ciphertext]';
    return originalText;
  } catch (err) {
    return '[Decryption Error: Malformed Ciphertext]';
  }
}

// --- TRIPLE DES ---
export function tripleDesEncrypt(text: string, key: string): string {
  if (!text) return '';
  const secret = key || 'default-secret-key';
  return CryptoJS.TripleDES.encrypt(text, secret).toString();
}

export function tripleDesDecrypt(ciphertext: string, key: string): string {
  if (!ciphertext) return '';
  const secret = key || 'default-secret-key';
  try {
    const bytes = CryptoJS.TripleDES.decrypt(ciphertext, secret);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (!originalText) return '[Decryption Failed: Invalid Key or Ciphertext]';
    return originalText;
  } catch (err) {
    return '[Decryption Error: Malformed Ciphertext]';
  }
}

// --- ONE-WAY HASHES ---
export function sha256Hash(text: string): string {
  if (!text) return '';
  return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
}

export function sha512Hash(text: string): string {
  if (!text) return '';
  return CryptoJS.SHA512(text).toString(CryptoJS.enc.Hex);
}

export function md5Hash(text: string): string {
  if (!text) return '';
  return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
}

// --- ENCODINGS ---
export function base64Encode(text: string): string {
  if (!text) return '';
  const words = CryptoJS.enc.Utf8.parse(text);
  return CryptoJS.enc.Base64.stringify(words);
}

export function base64Decode(encodedText: string): string {
  if (!encodedText) return '';
  try {
    const words = CryptoJS.enc.Base64.parse(encodedText);
    const result = CryptoJS.enc.Utf8.stringify(words);
    if (!result) return '[Invalid Base64 String]';
    return result;
  } catch (err) {
    return '[Base64 Decoding Error]';
  }
}

export function hexEncode(text: string): string {
  if (!text) return '';
  const words = CryptoJS.enc.Utf8.parse(text);
  return CryptoJS.enc.Hex.stringify(words);
}

export function hexDecode(encodedText: string): string {
  if (!encodedText) return '';
  try {
    const words = CryptoJS.enc.Hex.parse(encodedText.replace(/\s+/g, ''));
    const result = CryptoJS.enc.Utf8.stringify(words);
    if (!result) return '[Invalid Hex String]';
    return result;
  } catch (err) {
    return '[Hex Decoding Error]';
  }
}

export function binaryEncode(text: string): string {
  if (!text) return '';
  const result: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const bin = text.charCodeAt(i).toString(2).padStart(8, '0');
    result.push(bin);
  }
  return result.join(' ');
}

export function binaryDecode(binaryString: string): string {
  if (!binaryString) return '';
  try {
    const clean = binaryString.trim().split(/\s+/);
    let result = '';
    for (const b of clean) {
      if (!b) continue;
      result += String.fromCharCode(parseInt(b, 2));
    }
    return result;
  } catch (err) {
    return '[Binary Decoding Error]';
  }
}
