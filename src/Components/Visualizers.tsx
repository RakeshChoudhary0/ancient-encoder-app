import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  caesarEncrypt,
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
} from '../utils/cryptoEngine';
import { sha256Hash } from '../utils/cryptoJsHelpers';

// --- CAESAR VISUALIZER ---
export const CaesarVisualizer: React.FC = () => {
  const [text, setText] = useState('CRYPTO');
  const [shift, setShift] = useState(3);

  const charArray = text.split('');
  const shiftedArray = charArray.map(c => caesarEncrypt(c, shift));

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Interactive Caesar Shift Diagram</Text>
      <Text style={styles.cardDesc}>
        Adjust the shift value to see character mapping in real-time.
      </Text>

      <View style={styles.inputRow}>
        <Text style={styles.label}>Sample Text</Text>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          maxLength={10}
          autoCapitalize="characters"
          placeholderTextColor="#525252"
        />
      </View>

      <View style={styles.shiftControlRow}>
        <Text style={styles.label}>Shift (N = {shift})</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.btnSmall}
            onPress={() => setShift(prev => (prev > 1 ? prev - 1 : 25))}
            activeOpacity={0.7}
          >
            <Text style={styles.btnText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnSmall}
            onPress={() => setShift(prev => (prev < 25 ? prev + 1 : 1))}
            activeOpacity={0.7}
          >
            <Text style={styles.btnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.gridScroll}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        <View style={styles.diagramContainer}>
          <View style={styles.row}>
            <Text style={styles.rowHeader}>Input</Text>
            {charArray.map((ch, idx) => (
              <View key={`in-${idx}`} style={styles.charBoxInput}>
                <Text style={styles.charTextIn}>{ch || ' '}</Text>
                <Text style={styles.subText}>{ch ? ch.charCodeAt(0) : ''}</Text>
              </View>
            ))}
          </View>

          <View style={styles.arrowRow}>
            <Text style={styles.arrowHeader}>+{shift}</Text>
            {charArray.map((_, idx) => (
              <Text key={`arr-${idx}`} style={styles.arrowText}>
                ↓
              </Text>
            ))}
          </View>

          <View style={styles.row}>
            <Text style={styles.rowHeader}>Cipher</Text>
            {shiftedArray.map((ch, idx) => (
              <View key={`out-${idx}`} style={styles.charBoxOutput}>
                <Text style={styles.charTextOut}>{ch || ' '}</Text>
                <Text style={styles.subTextOut}>
                  {ch ? ch.charCodeAt(0) : ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// --- AES ROUND VISUALIZER ---
export const AESVisualizer: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    {
      name: 'Initial: AddRoundKey',
      desc: 'XOR the 128-bit input State matrix directly with the initial expanded master key block.',
      matrix: [
        '41',
        '62',
        '63',
        '64',
        '65',
        '66',
        '67',
        '68',
        '69',
        '6A',
        '6B',
        '6C',
        '6D',
        '6E',
        '6F',
        '70',
      ],
    },
    {
      name: 'Step 1: SubBytes',
      desc: 'Each byte is substituted with a non-linear S-Box lookup byte to create high confusion.',
      matrix: [
        '8A',
        '7B',
        '9C',
        'E4',
        '2F',
        '1A',
        '5D',
        '3B',
        'A1',
        'C9',
        '70',
        'F2',
        '03',
        '4E',
        '86',
        '11',
      ],
    },
    {
      name: 'Step 2: ShiftRows',
      desc: 'Row 0 is unchanged, Row 1 shifts left 1, Row 2 shifts left 2, Row 3 shifts left 3.',
      matrix: [
        '8A',
        '7B',
        '9C',
        'E4',
        '1A',
        '5D',
        '3B',
        '2F',
        '70',
        'F2',
        '03',
        'A1',
        '11',
        '03',
        '4E',
        '86',
      ],
    },
    {
      name: 'Step 3: MixColumns',
      desc: 'Matrix multiplication combines 4 bytes in each column over Galois Field GF(2^8).',
      matrix: [
        '04',
        '66',
        '81',
        'E5',
        'E0',
        'CB',
        '19',
        '9A',
        '48',
        'F8',
        'D3',
        '7A',
        '28',
        '06',
        '8C',
        '4C',
      ],
    },
    {
      name: 'Step 4: AddRoundKey',
      desc: 'The column-mixed matrix is XORed with Round Key 1 to complete Round 1 of 14.',
      matrix: [
        'D4',
        'E0',
        'B8',
        '1E',
        '27',
        'BF',
        'B4',
        '41',
        '11',
        '98',
        '5D',
        '52',
        'AE',
        'F1',
        'E5',
        '30',
      ],
    },
  ];

  const current = steps[activeStep];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>AES State Matrix Simulator</Text>
      <Text style={styles.cardDesc}>
        Step through Round 1 of the 4x4 State Transformation pipeline.
      </Text>

      <View style={styles.stepperContainer}>
        {steps.map((st, idx) => (
          <TouchableOpacity
            key={`st-${idx}`}
            style={[styles.stepDot, activeStep === idx && styles.stepDotActive]}
            onPress={() => setActiveStep(idx)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.stepDotText,
                activeStep === idx && styles.stepDotTextActive,
              ]}
            >
              {idx + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.stepInfoCard}>
        <Text style={styles.stepName}>{current.name}</Text>
        <Text style={styles.stepDesc}>{current.desc}</Text>
      </View>

      <Text style={styles.matrixLabel}>State Array Matrix (4x4)</Text>
      <View style={styles.matrixGrid}>
        {current.matrix.map((cell, idx) => (
          <View key={`cell-${idx}`} style={styles.matrixCell}>
            <Text style={styles.matrixCellText}>{cell}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// --- RSA MATH VISUALIZER ---
export const RSAVisualizer: React.FC = () => {
  const [keys, setKeys] = useState(() => generateRSAKeyPair());
  const [sampleMsg, setSampleMsg] = useState('HI');
  const [encrypted, setEncrypted] = useState(() =>
    rsaEncrypt('HI', keys.formattedPublic),
  );
  const [decrypted, setDecrypted] = useState(() =>
    rsaDecrypt(encrypted, keys.formattedPrivate),
  );

  const handleRegenerate = () => {
    const newK = generateRSAKeyPair();
    setKeys(newK);
    const enc = rsaEncrypt(sampleMsg, newK.formattedPublic);
    setEncrypted(enc);
    setDecrypted(rsaDecrypt(enc, newK.formattedPrivate));
  };

  const handleMsgChange = (val: string) => {
    setSampleMsg(val);
    const enc = rsaEncrypt(val, keys.formattedPublic);
    setEncrypted(enc);
    setDecrypted(rsaDecrypt(enc, keys.formattedPrivate));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>RSA Key Math Simulator</Text>
      <Text style={styles.cardDesc}>
        Explore how prime factoring and modular exponentiation create key pairs.
      </Text>

      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={handleRegenerate}
        activeOpacity={0.8}
      >
        <Text style={styles.btnPrimaryText}>Generate New Primes (p, q)</Text>
      </TouchableOpacity>

      <View style={styles.mathRow}>
        <View style={styles.mathPill}>
          <Text style={styles.mathLabel}>p</Text>
          <Text style={styles.mathVal}>{keys.primes.p}</Text>
        </View>
        <View style={styles.mathPill}>
          <Text style={styles.mathLabel}>q</Text>
          <Text style={styles.mathVal}>{keys.primes.q}</Text>
        </View>
        <View style={styles.mathPill}>
          <Text style={styles.mathLabel}>n = p*q</Text>
          <Text style={styles.mathVal}>{keys.publicKey.n}</Text>
        </View>
        <View style={styles.mathPill}>
          <Text style={styles.mathLabel}>φ(n)</Text>
          <Text style={styles.mathVal}>{keys.primes.phi}</Text>
        </View>
      </View>

      <View style={styles.keyBoxRow}>
        <View style={styles.keyBox}>
          <Text style={styles.keyBoxTitle}>Public Key (e, n)</Text>
          <Text style={styles.keyBoxBody}>e = {keys.publicKey.e}</Text>
          <Text style={styles.keyBoxBody}>n = {keys.publicKey.n}</Text>
        </View>
        <View style={styles.keyBox}>
          <Text style={styles.keyBoxTitle}>Private Key (d, n)</Text>
          <Text style={styles.keyBoxBody}>d = {keys.privateKey.d}</Text>
          <Text style={styles.keyBoxBody}>n = {keys.privateKey.n}</Text>
        </View>
      </View>

      <View style={styles.testSection}>
        <Text style={[styles.label, { marginBottom: 6 }]}>Test Message</Text>
        <TextInput
          style={styles.textInput}
          value={sampleMsg}
          onChangeText={handleMsgChange}
          maxLength={8}
        />
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>
            Encrypted Cipher: <Text style={styles.resultVal}>{encrypted}</Text>
          </Text>
          <Text style={styles.resultLabel}>
            Decrypted Output: <Text style={styles.resultVal}>{decrypted}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

// --- AVALANCHE EFFECT VISUALIZER ---
export const AvalancheVisualizer: React.FC = () => {
  const [textA, setTextA] = useState('Cryptography');
  const [textB, setTextB] = useState('cryptography'); // 1 letter case change

  const hashA = sha256Hash(textA);
  const hashB = sha256Hash(textB);

  // Calculate hex difference count
  let diffCount = 0;
  for (let i = 0; i < Math.max(hashA.length, hashB.length); i++) {
    if (hashA[i] !== hashB[i]) diffCount++;
  }
  const diffPercent = Math.round((diffCount / Math.max(hashA.length, 1)) * 100);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>SHA-256 Avalanche Visualizer</Text>
      <Text style={styles.cardDesc}>
        Compare how changing 1 character creates an unpredictable hash
        transformation.
      </Text>

      <View style={styles.avalancheInputs}>
        <View style={styles.avColumn}>
          <Text style={styles.label}>Text Sample A</Text>
          <TextInput
            style={styles.textInput}
            value={textA}
            onChangeText={setTextA}
          />
        </View>
        <View style={styles.avColumn}>
          <Text style={styles.label}>Text Sample B (1 char edit)</Text>
          <TextInput
            style={styles.textInput}
            value={textB}
            onChangeText={setTextB}
          />
        </View>
      </View>

      <View style={styles.diffBadge}>
        <Text style={styles.diffBadgeText}>
          Difference: {diffPercent}% of Hex Digits Changed
        </Text>
      </View>

      <View style={styles.hashResultBox}>
        <Text style={styles.hashBoxTitle}>Hash A</Text>
        <Text style={styles.hashText}>{hashA}</Text>

        <Text style={[styles.hashBoxTitle, { marginTop: 14 }]}>Hash B</Text>
        <Text style={styles.hashText}>
          {hashB.split('').map((char, idx) => (
            <Text
              key={`hb-${idx}`}
              style={char !== hashA[idx] ? styles.diffChar : styles.sameChar}
            >
              {char}
            </Text>
          ))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#09090B',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FAFAFA',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 18,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A1A1AA',
    marginBottom: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#18181B',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  shiftControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  counterContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  btnSmall: {
    backgroundColor: '#18181B',
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  btnText: {
    color: '#FAFAFA',
    fontWeight: '500',
    fontSize: 14,
  },
  gridScroll: {
    marginTop: 4,
  },
  diagramContainer: {
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeader: {
    width: 60,
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
  },
  charBoxInput: {
    width: 38,
    height: 48,
    backgroundColor: '#18181B',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  charTextIn: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FAFAFA',
  },
  subText: {
    fontSize: 9,
    color: '#71717A',
    marginTop: 2,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  arrowHeader: {
    width: 60,
    fontSize: 11,
    fontWeight: '500',
    color: '#525252',
  },
  arrowText: {
    width: 38,
    textAlign: 'center',
    marginRight: 6,
    color: '#525252',
    fontSize: 12,
  },
  charBoxOutput: {
    width: 38,
    height: 48,
    backgroundColor: '#FAFAFA',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  charTextOut: {
    fontSize: 14,
    fontWeight: '600',
    color: '#09090B',
  },
  subTextOut: {
    fontSize: 9,
    color: '#71717A',
    marginTop: 2,
  },
  // AES styles
  stepperContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  stepDot: {
    flex: 1,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  stepDotActive: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
  },
  stepDotText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
  },
  stepDotTextActive: {
    color: '#09090B',
  },
  stepInfoCard: {
    backgroundColor: '#18181B',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  stepName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FAFAFA',
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 12,
    color: '#A1A1AA',
    lineHeight: 16,
  },
  matrixLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#71717A',
    marginBottom: 10,
  },
  matrixGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 196,
    alignSelf: 'center',
    gap: 8,
  },
  matrixCell: {
    width: 43,
    height: 43,
    backgroundColor: '#18181B',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  matrixCellText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FAFAFA',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // RSA Styles
  btnPrimary: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnPrimaryText: {
    color: '#09090B',
    fontWeight: '600',
    fontSize: 13,
  },
  mathRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  mathPill: {
    flex: 1,
    backgroundColor: '#18181B',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  mathLabel: {
    fontSize: 10,
    color: '#71717A',
    marginBottom: 2,
  },
  mathVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FAFAFA',
  },
  keyBoxRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  keyBox: {
    flex: 1,
    backgroundColor: '#18181B',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  keyBoxTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A1A1AA',
    marginBottom: 6,
  },
  keyBoxBody: {
    fontSize: 11,
    color: '#FAFAFA',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  testSection: {
    marginTop: 4,
  },
  resultContainer: {
    marginTop: 10,
    gap: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: '#71717A',
  },
  resultVal: {
    color: '#FAFAFA',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  // Avalanche Styles
  avalancheInputs: {
    gap: 12,
    marginBottom: 16,
  },
  avColumn: {
    gap: 4,
  },
  diffBadge: {
    backgroundColor: '#18181B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  diffBadgeText: {
    color: '#A1A1AA',
    fontWeight: '500',
    fontSize: 11,
  },
  hashResultBox: {
    backgroundColor: '#18181B',
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  hashBoxTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#71717A',
    marginBottom: 4,
  },
  hashText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: '#A1A1AA',
    lineHeight: 16,
  },
  diffChar: {
    color: '#FAFAFA',
    fontWeight: '700',
    backgroundColor: '#27272A',
  },
  sameChar: {
    color: '#525252',
  },
});
