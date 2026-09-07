export interface LearningTopic {
  id: string;
  category: 'Fundamentals' | 'Algorithm Deep Dives' | 'Encodings & Hashes';
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  summary: string;
  sections: {
    heading: string;
    content: string;
    bulletPoints?: string[];
  }[];
  visualizerType?: 'caesar' | 'aes' | 'rsa' | 'avalanche' | 'encoding';
}

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: 'plaintext-vs-ciphertext',
    category: 'Fundamentals',
    title: 'Plaintext vs. Ciphertext',
    subtitle: 'The fundamental transformation of information',
    iconName: 'file-text-outline',
    badge: 'Core Concept',
    summary: 'Cryptography turns readable data into secret unintelligible strings to guarantee confidentiality over insecure networks.',
    sections: [
      {
        heading: 'What is Plaintext?',
        content: 'Plaintext represents unencrypted information in human-readable or raw format (such as plain text messages, JSON payload, or unencrypted text files). Anyone with access to plaintext can read it immediately.',
      },
      {
        heading: 'What is Ciphertext?',
        content: 'Ciphertext is the scrambled output produced by passing plaintext through an encryption algorithm using a mathematical key. Without the corresponding secret key, ciphertext looks like pseudo-random garbage.',
        bulletPoints: [
          'Confidentiality: Unauthorized viewers cannot read the message contents.',
          'Integrity: Alterations to ciphertext break valid decryption.',
          'Reversibility: Authorized key holders can recover original plaintext.',
        ],
      },
    ],
  },
  {
    id: 'symmetric-vs-asymmetric',
    category: 'Fundamentals',
    title: 'Symmetric vs. Asymmetric Encryption',
    subtitle: 'Single key simplicity vs. public/private key pairs',
    iconName: 'key-outline',
    badge: 'Core Concept',
    summary: 'Explore the architectural differences between shared secret key encryption and public key infrastructure.',
    sections: [
      {
        heading: 'Symmetric Encryption (Single Secret Key)',
        content: 'Symmetric algorithms (like AES-256 and Triple DES) use the exact same secret key for both encryption and decryption. Both sender and receiver must securely exchange the key prior to communication.',
        bulletPoints: [
          'High Performance: Blazing fast encryption speed, ideal for bulk data.',
          'Key Distribution Problem: Safely sharing the key across untrusted networks is difficult.',
        ],
      },
      {
        heading: 'Asymmetric Encryption (Public / Private Key Pairs)',
        content: 'Asymmetric algorithms (like RSA and ECC) generate a mathematically linked key pair: a Public Key (shared freely to encrypt) and a Private Key (kept strictly secret to decrypt).',
        bulletPoints: [
          'Solves Key Exchange: Anyone can encrypt using your public key, but only you can decrypt.',
          'Digital Signatures: Enables authenticating the sender identity.',
          'Slower Computation: Involves modular exponentiation of large numbers.',
        ],
      },
    ],
  },
  {
    id: 'encryption-encoding-hashing',
    category: 'Fundamentals',
    title: 'Encryption vs. Encoding vs. Hashing',
    subtitle: 'Understanding confidentiality, formatting, and integrity',
    iconName: 'swap-horizontal-outline',
    badge: 'Core Concept',
    summary: 'Distinguish between three frequently confused cryptographic primitives based on intent, keys, and reversibility.',
    sections: [
      {
        heading: '1. Encryption (Confidentiality)',
        content: 'Transforms data into ciphertext using a key. Fully reversible only with the secret/private key. Goal: Keep data private.',
      },
      {
        heading: '2. Encoding (Data Representation)',
        content: 'Transforms data into another format (e.g. Base64, Hex) for binary-to-text safety or web transmission. NO key is involved, and anyone can decode it instantly. Goal: Compatibility & Usability.',
      },
      {
        heading: '3. Hashing (Integrity & Non-Reversibility)',
        content: 'One-way mathematical function mapping variable input to a fixed-size hash output (digest). IMPOSSIBLE to reverse back to plaintext. Goal: Data verification & password hashing.',
      },
    ],
  },
  {
    id: 'caesar-cipher-deep-dive',
    category: 'Algorithm Deep Dives',
    title: 'Caesar Cipher Mechanics',
    subtitle: 'Ancient shift ciphers and character mapping',
    iconName: 'text-outline',
    badge: 'Classical Cipher',
    summary: 'The classic substitution cipher named after Julius Caesar, shifting letters of the alphabet by a fixed N offset.',
    sections: [
      {
        heading: 'Mathematical Definition',
        content: 'For an alphabet of 26 letters and shift K, encryption of character x is: E(x) = (x + K) mod 26. Decryption is: D(x) = (x - K + 26) mod 26.',
      },
      {
        heading: 'Security & Cryptanalysis',
        content: 'Caesar cipher has only 25 possible shift keys, making it extremely easy to break using brute force or letter frequency analysis (e.g., "E" and "T" appear most frequently in English text).',
      },
    ],
    visualizerType: 'caesar',
  },
  {
    id: 'aes-deep-dive',
    category: 'Algorithm Deep Dives',
    title: 'AES (Advanced Encryption Standard)',
    subtitle: 'Substitution-Permutation Networks and Round Transformations',
    iconName: 'shield-checkmark-outline',
    badge: 'Symmetric Standard',
    summary: 'AES is the global standard symmetric block cipher adopted by US NIST in 2001, operating on 128-bit blocks across 10, 12, or 14 round transformations.',
    sections: [
      {
        heading: 'How AES Block Cipher Works',
        content: 'AES takes a 128-bit block (16 bytes) arranged in a 4x4 matrix called the State Array. It processes the state through multiple rounds consisting of four core operations:',
        bulletPoints: [
          'SubBytes: Non-linear byte substitution using a lookup S-Box table.',
          'ShiftRows: Cyclically shifting bytes in each row of the 4x4 state array.',
          'MixColumns: Mixing data within matrix columns using Galois Field arithmetic.',
          'AddRoundKey: XORing state matrix with a subkey derived from master key expansion.',
        ],
      },
      {
        heading: 'Key Lengths & Round Counts',
        content: 'AES-128 (10 rounds), AES-192 (12 rounds), AES-256 (14 rounds). Modern CPUs include hardware AES-NI instructions for hardware-accelerated encryption.',
      },
    ],
    visualizerType: 'aes',
  },
  {
    id: 'rsa-deep-dive',
    category: 'Algorithm Deep Dives',
    title: 'RSA Algorithm & Prime Math',
    subtitle: 'Modular exponentiation and trapdoor one-way functions',
    iconName: 'lock-closed-outline',
    badge: 'Asymmetric Standard',
    summary: 'RSA relies on the hard mathematical problem of factoring the product of two ultra-large prime numbers.',
    sections: [
      {
        heading: 'Step-by-Step RSA Key Generation',
        content: '1. Select two large distinct prime numbers p and q.\n2. Compute modulus n = p * q.\n3. Compute Euler totient φ(n) = (p - 1) * (q - 1).\n4. Choose public exponent e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1 (commonly 65537).\n5. Compute private exponent d such that (d * e) ≡ 1 mod φ(n).',
      },
      {
        heading: 'Encryption & Decryption Math',
        content: 'Encryption of message text character m: ciphertext c = (m ^ e) mod n.\nDecryption: plaintext m = (c ^ d) mod n.',
      },
    ],
    visualizerType: 'rsa',
  },
  {
    id: 'hashing-avalanche-effect',
    category: 'Algorithm Deep Dives',
    title: 'Cryptographic Hashes & Avalanche Effect',
    subtitle: 'Why SHA-256 is non-reversible and sensitive to tiny input changes',
    iconName: 'git-network-outline',
    badge: 'One-Way Hash',
    summary: 'A 1-bit difference in input text causes an unpredictable 50%+ bit flip change across the generated digest output.',
    sections: [
      {
        heading: 'Properties of Cryptographic Hash Functions',
        content: 'Cryptographic hash algorithms (SHA-256, SHA-512) guarantee three key properties:',
        bulletPoints: [
          'Pre-image Resistance (One-Way): Given hash H, it is computationally impossible to reconstruct message M.',
          'Second Pre-image Resistance: Given message M1, impossible to find M2 where H(M1) = H(M2).',
          'Collision Resistance: Impossible to find any two arbitrary messages M1 & M2 yielding identical hashes.',
        ],
      },
      {
        heading: 'The Avalanche Effect',
        content: 'The avalanche effect guarantees high entropy and unpredictability. Changing a single letter or even a single capitalization in a 100-page document produces a completely different hash string.',
      },
    ],
    visualizerType: 'avalanche',
  },
];
