import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LEARNING_TOPICS } from '../data/learningTopics';
import {
  CaesarVisualizer,
  AESVisualizer,
  RSAVisualizer,
  AvalancheVisualizer,
} from '../Components/Visualizers';
import { SafeAreaView } from 'react-native-safe-area-context';

interface TopicDetailScreenProps {
  route: any;
  navigation: any;
}

export const TopicDetailScreen: React.FC<TopicDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { topicId } = route.params || {};
  const topic =
    LEARNING_TOPICS.find(t => t.id === topicId) || LEARNING_TOPICS[0];

  const renderVisualizer = () => {
    switch (topic.visualizerType) {
      case 'caesar':
        return <CaesarVisualizer />;
      case 'aes':
        return <AESVisualizer />;
      case 'rsa':
        return <RSAVisualizer />;
      case 'avalanche':
        return <AvalancheVisualizer />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backBtnText}>← Back to Crypto</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topic.title}</Text>
        <Text style={styles.headerSubtitle}>{topic.subtitle}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overview Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryBadge}>{topic.badge}</Text>
          <Text style={styles.summaryText}>{topic.summary}</Text>
        </View>

        {/* Interactive Visualizer Component if available */}
        {renderVisualizer()}

        {/* Detailed Content Sections */}
        {topic.sections.map((section, idx) => (
          <View key={`sec-${idx}`} style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>

            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <View style={styles.bulletList}>
                {section.bulletPoints.map((bp, bpIdx) => (
                  <View key={`bp-${bpIdx}`} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{bp}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
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
  backBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#18181B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272A',
    marginBottom: 16,
  },
  backBtnText: {
    color: '#34D399',
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 0.2,
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
  summaryCard: {
    backgroundColor: '#121215',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  summaryBadge: {
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  summaryText: {
    color: '#FAFAFA',
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  sectionCard: {
    backgroundColor: '#121215',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FAFAFA',
    marginBottom: 10,
    letterSpacing: -0.2,
  },
  sectionContent: {
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 21,
  },
  bulletList: {
    marginTop: 14,
    backgroundColor: '#09090B',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1E1E24',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletDot: {
    color: '#10B981',
    fontSize: 16,
    marginRight: 10,
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    color: '#D4D4D8',
    lineHeight: 20,
  },
});

export default TopicDetailScreen;
