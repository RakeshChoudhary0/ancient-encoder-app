import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Platform,
} from 'react-native';

import { copyToClipboard } from '../utils/clipboardHelper';

import {
  caesarEncrypt,
  caesarDecrypt,
  rot13,
  vigenereEncrypt,
  vigenereDecrypt,
  railFenceEncrypt,
  railFenceDecrypt,
  blowfishEncrypt,
  blowfishDecrypt,
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  RSAKeyPair,
} from '../utils/cryptoEngine';

import {
  aesEncrypt,
  aesDecrypt,
  desEncrypt,
  desDecrypt,
  tripleDesEncrypt,
  tripleDesDecrypt,
  sha256Hash,
  sha512Hash,
  md5Hash,
  base64Encode,
  base64Decode,
  hexEncode,
  hexDecode,
  binaryEncode,
  binaryDecode,
} from '../utils/cryptoJsHelpers';
import { SafeAreaView } from 'react-native-safe-area-context';

type CategoryType =
  | 'Symmetric'
  | 'Asymmetric'
  | 'Classical'
  | 'Hashing'
  | 'Encodings';

interface AlgorithmItem {
  id: string;
  name: string;
  category: CategoryType;
  requiresKey: boolean;
  keyType?: 'secret' | 'number' | 'text' | 'rails' | 'rsa';
  isOneWay?: boolean;
}

const ALGORITHMS: AlgorithmItem[] = [
  // Symmetric
  {
    id: 'AES-256',
    name: 'AES-256',
    category: 'Symmetric',
    requiresKey: true,
    keyType: 'secret',
  },
  {
    id: 'DES',
    name: 'DES',
    category: 'Symmetric',
    requiresKey: true,
    keyType: 'secret',
  },
  {
    id: 'TripleDES',
    name: 'Triple DES',
    category: 'Symmetric',
    requiresKey: true,
    keyType: 'secret',
  },
  {
    id: 'Blowfish',
    name: 'Blowfish',
    category: 'Symmetric',
    requiresKey: true,
    keyType: 'secret',
  },

  // Asymmetric
  {
    id: 'RSA',
    name: 'RSA (Key Pair)',
    category: 'Asymmetric',
    requiresKey: true,
    keyType: 'rsa',
  },

  // Classical
  {
    id: 'Caesar',
    name: 'Caesar Cipher',
    category: 'Classical',
    requiresKey: true,
    keyType: 'number',
  },
  {
    id: 'Vigenere',
    name: 'Vigenère Cipher',
    category: 'Classical',
    requiresKey: true,
    keyType: 'text',
  },
  { id: 'ROT13', name: 'ROT13', category: 'Classical', requiresKey: false },
  {
    id: 'RailFence',
    name: 'Rail Fence',
    category: 'Classical',
    requiresKey: true,
    keyType: 'rails',
  },

  // Hashing
  {
    id: 'SHA-256',
    name: 'SHA-256',
    category: 'Hashing',
    requiresKey: false,
    isOneWay: true,
  },
  {
    id: 'SHA-512',
    name: 'SHA-512',
    category: 'Hashing',
    requiresKey: false,
    isOneWay: true,
  },
  {
    id: 'MD5',
    name: 'MD5',
    category: 'Hashing',
    requiresKey: false,
    isOneWay: true,
  },

  // Encodings
  { id: 'Base64', name: 'Base64', category: 'Encodings', requiresKey: false },
  { id: 'Hex', name: 'Hexadecimal', category: 'Encodings', requiresKey: false },
  {
    id: 'Binary',
    name: 'Binary (UTF-8)',
    category: 'Encodings',
    requiresKey: false,
  },
];

const CATEGORIES: CategoryType[] = [
  'Symmetric',
  'Asymmetric',
  'Classical',
  'Hashing',
  'Encodings',
];

export const HomeScreen: React.FC = () => {
  const [inputText, setInputText] = useState('Hello Antigravity Crypto Lab!');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryType>('Symmetric');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmItem>(
    ALGORITHMS[0],
  );
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  // Key states
  const [secretKey, setSecretKey] = useState('mySecretKey123');
  const [shiftValue, setShiftValue] = useState('3');
  const [vigenereKey, setVigenereKey] = useState('KEY');
  const [railsValue, setRailsValue] = useState('3');

  // RSA Key state
  const [rsaKeyPair, setRsaKeyPair] = useState<RSAKeyPair>(() =>
    generateRSAKeyPair(),
  );
  const [showRsaModal, setShowRsaModal] = useState(false);

  // Output & UI states
  const [outputText, setOutputText] = useState('');
  const [copyToast, setCopyToast] = useState(false);

  useEffect(() => {
    const algosInCategory = ALGORITHMS.filter(
      a => a.category === selectedCategory,
    );
    if (!algosInCategory.some(a => a.id === selectedAlgo.id)) {
      setSelectedAlgo(algosInCategory[0]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let result = '';
    const isEnc = mode === 'encrypt';

    switch (selectedAlgo.id) {
      case 'AES-256':
        result = isEnc
          ? aesEncrypt(inputText, secretKey)
          : aesDecrypt(inputText, secretKey);
        break;
      case 'DES':
        result = isEnc
          ? desEncrypt(inputText, secretKey)
          : desDecrypt(inputText, secretKey);
        break;
      case 'TripleDES':
        result = isEnc
          ? tripleDesEncrypt(inputText, secretKey)
          : tripleDesDecrypt(inputText, secretKey);
        break;
      case 'Blowfish':
        result = isEnc
          ? blowfishEncrypt(inputText, secretKey)
          : blowfishDecrypt(inputText, secretKey);
        break;
      case 'RSA':
        result = isEnc
          ? rsaEncrypt(inputText, rsaKeyPair.formattedPublic)
          : rsaDecrypt(inputText, rsaKeyPair.formattedPrivate);
        break;
      case 'Caesar': {
        const s = parseInt(shiftValue, 10) || 3;
        result = isEnc
          ? caesarEncrypt(inputText, s)
          : caesarDecrypt(inputText, s);
        break;
      }
      case 'Vigenere':
        result = isEnc
          ? vigenereEncrypt(inputText, vigenereKey)
          : vigenereDecrypt(inputText, vigenereKey);
        break;
      case 'ROT13':
        result = rot13(inputText);
        break;
      case 'RailFence': {
        const r = parseInt(railsValue, 10) || 3;
        result = isEnc
          ? railFenceEncrypt(inputText, r)
          : railFenceDecrypt(inputText, r);
        break;
      }
      case 'SHA-256':
        result = sha256Hash(inputText);
        break;
      case 'SHA-512':
        result = sha512Hash(inputText);
        break;
      case 'MD5':
        result = md5Hash(inputText);
        break;
      case 'Base64':
        result = isEnc ? base64Encode(inputText) : base64Decode(inputText);
        break;
      case 'Hex':
        result = isEnc ? hexEncode(inputText) : hexDecode(inputText);
        break;
      case 'Binary':
        result = isEnc ? binaryEncode(inputText) : binaryDecode(inputText);
        break;
      default:
        result = inputText;
    }

    setOutputText(result);
  }, [
    inputText,
    selectedAlgo,
    mode,
    secretKey,
    shiftValue,
    vigenereKey,
    railsValue,
    rsaKeyPair,
  ]);

  const handleCopy = () => {
    if (!outputText) return;
    copyToClipboard(outputText);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2000);
  };

  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    if (!selectedAlgo.isOneWay) {
      setMode(prev => (prev === 'encrypt' ? 'decrypt' : 'encrypt'));
    }
  };

  const handleGenerateNewRSA = () => {
    const newKeys = generateRSAKeyPair();
    setRsaKeyPair(newKeys);
  };

  const currentCategoryAlgos = ALGORITHMS.filter(
    a => a.category === selectedCategory,
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Enhanced Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerBadge}>LAB</Text>
          <Text style={styles.headerTitle}>Crypto Engine</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Real-time Encryption & Decryption Playground
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Category Chips */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryChip,
                selectedCategory === cat && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === cat && styles.categoryChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Algorithm Chips */}
        <Text style={styles.sectionLabel}>ALGORITHM</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
        >
          {currentCategoryAlgos.map(algo => (
            <TouchableOpacity
              key={algo.id}
              style={[
                styles.algoChip,
                selectedAlgo.id === algo.id && styles.algoChipActive,
              ]}
              onPress={() => setSelectedAlgo(algo)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.algoChipText,
                  selectedAlgo.id === algo.id && styles.algoChipTextActive,
                ]}
              >
                {algo.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Dynamic Key Input Section */}
        {selectedAlgo.requiresKey && (
          <View style={styles.keyContainer}>
            <Text style={styles.keyTitle}>KEY CONFIGURATION</Text>

            {/* Secret Key Input */}
            {selectedAlgo.keyType === 'secret' && (
              <View style={styles.keyInputRow}>
                <TextInput
                  style={styles.keyInput}
                  value={secretKey}
                  onChangeText={setSecretKey}
                  placeholder="Enter secret key..."
                  placeholderTextColor="#71717A"
                />
                <TouchableOpacity
                  style={styles.keyBtn}
                  onPress={() =>
                    setSecretKey(Math.random().toString(36).substring(2, 10))
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.keyBtnText}>Generate</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Caesar Shift Input */}
            {selectedAlgo.keyType === 'number' && (
              <View style={styles.stepperRow}>
                <Text style={styles.stepperLabel}>Shift Value (N)</Text>
                <View style={styles.stepperControls}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => {
                      const num = parseInt(shiftValue, 10) || 1;
                      setShiftValue(Math.max(1, num - 1).toString());
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.stepperInput}
                    value={shiftValue}
                    onChangeText={setShiftValue}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => {
                      const num = parseInt(shiftValue, 10) || 1;
                      setShiftValue((num + 1).toString());
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Vigenere Key Input */}
            {selectedAlgo.keyType === 'text' && (
              <TextInput
                style={styles.keyInput}
                value={vigenereKey}
                onChangeText={setVigenereKey}
                placeholder="Enter Keyword (e.g. SECRET)..."
                placeholderTextColor="#71717A"
                autoCapitalize="characters"
              />
            )}

            {/* Rail Fence Rails Input */}
            {selectedAlgo.keyType === 'rails' && (
              <View style={styles.stepperRow}>
                <Text style={styles.stepperLabel}>Number of Rails (N)</Text>
                <View style={styles.stepperControls}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => {
                      const num = parseInt(railsValue, 10) || 2;
                      setRailsValue(Math.max(2, num - 1).toString());
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepBtnText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.stepperInput}
                    value={railsValue}
                    onChangeText={setRailsValue}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => {
                      const num = parseInt(railsValue, 10) || 2;
                      setRailsValue((num + 1).toString());
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* RSA Key Pair Display & Modal */}
            {selectedAlgo.keyType === 'rsa' && (
              <View style={styles.rsaKeySection}>
                <View style={styles.rsaInfoRow}>
                  <Text style={styles.rsaBadge}>
                    Primes: {rsaKeyPair.primes.p}, {rsaKeyPair.primes.q}
                  </Text>
                  <Text style={styles.rsaBadge}>
                    Modulus n: {rsaKeyPair.publicKey.n}
                  </Text>
                </View>
                <View style={styles.rsaActionsRow}>
                  <TouchableOpacity
                    style={styles.rsaActionBtn}
                    onPress={handleGenerateNewRSA}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.rsaActionText}>New Key Pair</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rsaActionBtnSecondary}
                    onPress={() => setShowRsaModal(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.rsaActionTextSec}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Input Box */}
        <View style={styles.boxContainer}>
          <View style={styles.boxHeader}>
            <Text style={styles.boxTitle}>SOURCE MESSAGE</Text>
            <Text style={styles.charCount}>{inputText.length} chars</Text>
          </View>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message here..."
            placeholderTextColor="#71717A"
            textAlignVertical="top"
          />
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            disabled={selectedAlgo.isOneWay}
            style={[
              styles.modeBtn,
              mode === 'encrypt' && styles.modeBtnActive,
              selectedAlgo.isOneWay && styles.modeBtnDisabled,
            ]}
            onPress={() => setMode('encrypt')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.modeBtnText,
                mode === 'encrypt' && styles.modeBtnTextActive,
              ]}
            >
              Encrypt
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={selectedAlgo.isOneWay}
            style={[
              styles.modeBtn,
              mode === 'decrypt' && styles.modeBtnActive,
              selectedAlgo.isOneWay && styles.modeBtnDisabled,
            ]}
            onPress={() => setMode('decrypt')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.modeBtnText,
                mode === 'decrypt' && styles.modeBtnTextActive,
              ]}
            >
              Decrypt
            </Text>
          </TouchableOpacity>
        </View>

        {selectedAlgo.isOneWay && (
          <Text style={styles.oneWayNotice}>
            Hashing algorithms are one-way functions. Decryption is disabled.
          </Text>
        )}

        {/* Output Box */}
        <View style={styles.boxContainerOutput}>
          <View style={styles.boxHeader}>
            <Text style={styles.boxTitleOutput}>
              RESULT ({selectedAlgo.name}{' '}
              {selectedAlgo.isOneWay ? 'HASH' : mode.toUpperCase()})
            </Text>
            {copyToast && <Text style={styles.toastText}>Copied</Text>}
          </View>

          <TextInput
            style={styles.textAreaOutput}
            multiline
            numberOfLines={4}
            value={outputText}
            editable={false}
            textAlignVertical="top"
          />

          {/* Action Buttons */}
          <View style={styles.outputActionsRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Text style={styles.actionBtnText}>Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnSwap}
              onPress={handleSwap}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnSwapText}>Swap to Input</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* RSA Modal */}
      <Modal visible={showRsaModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>RSA Key Pair Details</Text>

            <Text style={styles.keyLabel}>PUBLIC KEY</Text>
            <TextInput
              style={styles.keyArea}
              multiline
              editable={false}
              value={rsaKeyPair.formattedPublic}
            />

            <Text style={styles.keyLabel}>PRIVATE KEY</Text>
            <TextInput
              style={styles.keyArea}
              multiline
              editable={false}
              value={rsaKeyPair.formattedPrivate}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowRsaModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#09090B',
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    letterSpacing: 0.8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FAFAFA',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginTop: 4,
    fontWeight: '400',
    lineHeight: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  chipRow: {
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#121215',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  categoryChipActive: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  categoryChipText: {
    color: '#A1A1AA',
    fontWeight: '500',
    fontSize: 12,
  },
  categoryChipTextActive: {
    color: '#09090B',
    fontWeight: '700',
  },
  algoChip: {
    backgroundColor: '#121215',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  algoChipActive: {
    backgroundColor: '#18181B',
    borderColor: '#34D399',
  },
  algoChipText: {
    color: '#A1A1AA',
    fontWeight: '500',
    fontSize: 12,
  },
  algoChipTextActive: {
    color: '#34D399',
    fontWeight: '700',
  },
  keyContainer: {
    backgroundColor: '#121215',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  keyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 0.8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  keyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  keyInput: {
    flex: 1,
    backgroundColor: '#09090B',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FAFAFA',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  keyBtn: {
    backgroundColor: '#18181B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34D399',
  },
  keyBtnText: {
    color: '#34D399',
    fontWeight: '600',
    fontSize: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperLabel: {
    fontSize: 13,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBtn: {
    width: 36,
    height: 36,
    backgroundColor: '#18181B',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  stepBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34D399',
  },
  stepperInput: {
    width: 50,
    height: 36,
    backgroundColor: '#09090B',
    borderRadius: 8,
    textAlign: 'center',
    color: '#FAFAFA',
    fontWeight: '600',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingVertical: 0,
  },
  rsaKeySection: {
    marginTop: 2,
  },
  rsaInfoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  rsaBadge: {
    backgroundColor: '#09090B',
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '500',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  rsaActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rsaActionBtn: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  rsaActionText: {
    color: '#09090B',
    fontWeight: '700',
    fontSize: 12,
  },
  rsaActionBtnSecondary: {
    backgroundColor: '#09090B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  rsaActionTextSec: {
    color: '#FAFAFA',
    fontWeight: '500',
    fontSize: 12,
  },
  boxContainer: {
    backgroundColor: '#121215',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  boxTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  charCount: {
    fontSize: 11,
    color: '#71717A',
  },
  textArea: {
    backgroundColor: '#09090B',
    borderRadius: 8,
    padding: 12,
    color: '#FAFAFA',
    fontSize: 13,
    lineHeight: 20,
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#121215',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#34D399',
  },
  modeBtnDisabled: {
    opacity: 0.25,
  },
  modeBtnText: {
    color: '#A1A1AA',
    fontWeight: '500',
    fontSize: 12,
  },
  modeBtnTextActive: {
    color: '#09090B',
    fontWeight: '700',
  },
  oneWayNotice: {
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: -10,
  },
  boxContainerOutput: {
    backgroundColor: '#121215',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#27272A',
    borderLeftWidth: 3,
    borderLeftColor: '#34D399',
  },
  boxTitleOutput: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  toastText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  textAreaOutput: {
    backgroundColor: '#09090B',
    borderRadius: 8,
    padding: 12,
    color: '#34D399',
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  outputActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    backgroundColor: '#18181B',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  actionBtnText: {
    color: '#FAFAFA',
    fontWeight: '500',
    fontSize: 12,
  },
  actionBtnSwap: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  actionBtnSwapText: {
    color: '#09090B',
    fontWeight: '700',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#121215',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FAFAFA',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  keyLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#71717A',
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  keyArea: {
    backgroundColor: '#09090B',
    borderRadius: 8,
    padding: 12,
    color: '#A1A1AA',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    height: 90,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  modalCloseBtn: {
    backgroundColor: '#34D399',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    color: '#09090B',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default HomeScreen;
