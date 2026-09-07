# 🔐 Ancient Encoder — From Ancient Indian Knowledge to Digital Encoding

> **Ancient Encoder** (Antigravity Crypto Lab & Academy) is a comprehensive React Native application designed to bridge the evolutionary gap between classical encryption systems—dating back to ancient knowledge & historical cipher techniques—and modern cryptographic algorithms & digital encodings.

---

## 🌟 Overview & Concept

Cryptography has evolved over thousands of years from early secret-writing systems and symbolic encodings to complex mathematical protocols securing global digital communication today. 

**Ancient Encoder** serves as both a **Real-Time Cryptographic Playground** and an **Interactive Educational Academy**:
- **Real-Time Crypto Lab**: Test and experiment with various encryption, decryption, hashing, and encoding algorithms instantly with dynamic key management.
- **Interactive Visualizers**: Step through 4x4 state matrix transformations in AES, visualize Caesar shift character mappings, generate real RSA prime pairs (\(p, q, n, \phi(n)\)), and analyze bit-flip entropy via the SHA-256 Avalanche Effect.
- **Crypto Academy**: Dive deep into cryptographic fundamentals, asymmetric vs. symmetric security, trapdoor functions, and data representation.

---

## 📱 App Structure

The codebase follows a modular React Native & TypeScript architecture:

```
Crypto/
├── App.tsx                    # Root component with SafeAreaProvider & NavigationContainer
├── index.js                   # Application entry point & React Native registry
├── package.json               # Project manifest, npm scripts, and dependencies
├── tsconfig.json              # TypeScript configuration
├── android/                   # Native Android platform codebase & Gradle build files
├── ios/                       # Native iOS platform codebase & CocoaPods configuration
└── src/                       # Application source directory
    ├── Components/
    │   └── Visualizers.tsx    # Interactive visualizers (Caesar Shift, AES 4x4 State, RSA Math, Avalanche Effect)
    ├── data/
    │   └── learningTopics.ts  # Curriculum content and lesson metadata for Crypto Academy
    ├── navigation/
    │   └── AppNavigator.tsx   # React Navigation setup (Bottom Tab Navigator & Native Stack)
    ├── screens/
    │   ├── HomeScreen.tsx     # Real-time Crypto Lab Playground (Algorithm selection, key management, output copy/swap)
    │   ├── LearnScreen.tsx    # Crypto Academy directory with search & category filtering
    │   └── TopicDetailScreen.tsx # Detailed lesson view with interactive diagram integration
    └── utils/
        ├── clipboardHelper.ts # Cross-platform clipboard utility
        ├── cryptoEngine.ts    # Pure TypeScript implementations (Caesar, ROT13, Vigenère, Rail Fence, Blowfish, RSA)
        └── cryptoJsHelpers.ts # CryptoJS library wrappers (AES-256, DES, 3DES, SHA-256, SHA-512, MD5, Base64, Hex, Binary)
```

---

## 🔒 Cryptographic Methods & Algorithms

The application implements **15 total algorithms** organized across **5 distinct categories**:

### 1. 🔑 Symmetric Key Encryption (Reversible with Secret Key)
*Both sender and recipient use the same shared secret key to encrypt and decrypt data.*
* **AES-256 (Advanced Encryption Standard)**: 256-bit block cipher operating on a 4x4 byte state matrix with subbyte substitution, row shifting, column mixing, and round key addition.
* **DES (Data Encryption Standard)**: Classic 56-bit symmetric block cipher.
* **Triple DES (3DES)**: Enhanced DES variant applying the DES cipher three times sequentially per block.
* **Blowfish**: Pure TypeScript simulation of the 64-bit block cipher featuring key-dependent S-boxes and round transformations.

### 2. 🛡️ Asymmetric Encryption (Public / Private Key Pairs)
*Uses mathematically linked key pairs for encryption and decryption.*
* **RSA (Rivest–Shamir–Adleman)**: Asymmetric cryptosystem with real-time prime number generation (\(p, q\)), public key exponent (\(e\)), private key exponent (\(d\)), and modulus (\(n\)). Implements modular exponentiation (\(c = m^e \bmod n\) and \(m = c^d \bmod n\)).

### 3. 📜 Classical & Historical Ciphers (Reversible with Shift / Key)
*Historical cipher mechanics that laid the foundation for modern secret communication.*
* **Caesar Cipher**: Character substitution cipher shifting letters by an adjustable numeric offset \(N\) (\(E(x) = (x + N) \bmod 26\)).
* **Vigenère Cipher**: Polyalphabetic substitution cipher using a text keyword to dynamically alter shifts.
* **ROT13**: Fixed-offset substitution cipher (Caesar shift \(N = 13\)).
* **Rail Fence Cipher**: Transposition cipher writing plaintext in a zig-zag pattern across \(N\) parallel rails.

### 4. ⚡ One-Way Hashes (Integrity Verification)
*One-way mathematical digest functions. Decryption is intentionally disabled.*
* **SHA-256**: 256-bit Secure Hash Algorithm standard for cryptographic integrity and blockchain verification.
* **SHA-512**: High-security 512-bit Secure Hash Algorithm variant.
* **MD5**: 128-bit Message Digest algorithm used for checksums and legacy verification.

### 5. 🔤 Data Encodings (Reversible Data Representation)
*Keyless data format transformations for safe transmission and storage.*
* **Base64**: UTF-8 to Base64 ASCII string conversion.
* **Hexadecimal (Hex)**: Byte stream to base-16 string conversion.
* **Binary (UTF-8)**: Character to 8-bit binary representation.

---

## 🛠️ Environment Requirements

Before running the application, ensure your development environment satisfies the following prerequisites:

| Requirement | Minimum / Recommended Version | Note |
| :--- | :--- | :--- |
| **Node.js** | `>= 22.11.0` | Required (defined in `package.json` engines) |
| **npm** | `>= 10.0.0` | Package manager |
| **React Native CLI** | `20.2.0` | `@react-native-community/cli` |
| **iOS Development** | Xcode 15+, CocoaPods, Ruby 3.0+ | macOS only (iOS Simulator or Device) |
| **Android Development** | Android Studio, JDK 17+, Android SDK 34+ | Android Emulator or physical device |

---

## 🚀 How to Run the Application

### 1. Install Dependencies
Run the following command from the root directory:
```sh
npm install
```

### 2. Start Metro Bundler
Start the Metro development server:
```sh
npm start
```

### 3. Run on iOS (macOS only)
Install CocoaPods dependencies (first time or when native modules change):
```sh
npm run ios:pod
```
Launch the app on the iOS Simulator:
```sh
npm run ios
```

### 4. Run on Android
Ensure an Android emulator is running or an Android device is connected via USB debugging:
```sh
npm run android
```

---

## 📜 Available Scripts

- `npm start` — Starts the Metro bundler with cache reset.
- `npm run ios` — Builds and launches the app on iOS Simulator.
- `npm run android` — Builds and launches the app on Android Emulator/Device.
- `npm run ios:pod` — Navigates to `ios/` and executes `pod install`.
- `npm run android:gradle` — Cleans the Gradle cache in `android/`.
- `npm run lint` — Runs ESLint code style checking.
- `npm run test` — Executes unit tests with Jest.

---

## 📄 License

This project is open-source and available under the **MIT License**.
