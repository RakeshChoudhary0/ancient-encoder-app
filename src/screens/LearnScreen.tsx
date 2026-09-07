import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LEARNING_TOPICS, LearningTopic } from '../data/learningTopics';

interface LearnScreenProps {
  navigation: any;
}

const CATEGORIES = ['All', 'Fundamentals', 'Algorithm Deep Dives'] as const;

// Extracted Sub-components for Optimization
const CategoryChip = React.memo<{
  category: string;
  isSelected: boolean;
  onSelect: (category: string) => void;
}>(({ category, isSelected, onSelect }) => {
  const handlePress = useCallback(
    () => onSelect(category),
    [category, onSelect],
  );

  return (
    <TouchableOpacity
      style={[styles.filterChip, isSelected && styles.filterChipActive]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
});

const TopicCard = React.memo<{
  topic: LearningTopic;
  onPress: (id: string) => void;
}>(({ topic, onPress }) => {
  const handlePress = useCallback(() => onPress(topic.id), [topic.id, onPress]);

  return (
    <TouchableOpacity
      style={styles.topicCard}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.badge}>{topic.badge}</Text>
        {topic.visualizerType && (
          <View style={styles.visualizerTag}>
            <View style={styles.visualizerDot} />
            <Text style={styles.visualizerTagText}>Interactive Visualizer</Text>
          </View>
        )}
      </View>

      <Text style={styles.topicTitle}>{topic.title}</Text>
      <Text style={styles.topicSubtitle}>{topic.subtitle}</Text>
      <Text style={styles.topicSummary}>{topic.summary}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.readMoreText}>Explore Lesson & Diagram →</Text>
      </View>
    </TouchableOpacity>
  );
});

export const LearnScreen: React.FC<LearnScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Memoized filter logic to avoid re-calculating on un-related renders
  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return LEARNING_TOPICS.filter(t => {
      const matchesCat =
        selectedCategory === 'All' || t.category === selectedCategory;
      const matchesSearch =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.subtitle.toLowerCase().includes(query) ||
        t.summary.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSelectTopic = useCallback(
    (topicId: string) => {
      navigation.navigate('TopicDetail', { topicId });
    },
    [navigation],
  );

  const renderTopicItem: ListRenderItem<LearningTopic> = useCallback(
    ({ item }) => <TopicCard topic={item} onPress={handleSelectTopic} />,
    [handleSelectTopic],
  );

  const keyExtractor = useCallback((item: LearningTopic) => item.id, []);

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerBadge}>ACADEMY</Text>
          <Text style={styles.headerTitle}>Crypto Academy</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Interactive lessons & visual mechanical breakdowns
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search ciphers, math, or concepts..."
            placeholderTextColor="#71717A"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <CategoryChip
              category={item}
              isSelected={selectedCategory === item}
              onSelect={setSelectedCategory}
            />
          )}
        />
      </View>

      {/* Topics List */}
      <FlatList
        data={filteredTopics}
        renderItem={renderTopicItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No topics match your search.</Text>
          </View>
        }
      />
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
  },
  headerBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 10,
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
    lineHeight: 18,
  },
  searchBox: {
    marginTop: 16,
  },
  searchInput: {
    backgroundColor: '#121215',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FAFAFA',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  filterBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#09090B',
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  filterChip: {
    backgroundColor: '#121215',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  filterChipActive: {
    backgroundColor: '#34D399',
    borderColor: '#34D399',
  },
  filterChipText: {
    color: '#A1A1AA',
    fontWeight: '500',
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#09090B',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
  topicCard: {
    backgroundColor: '#121215',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    backgroundColor: '#18181B',
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#27272A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  visualizerTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  visualizerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  visualizerTagText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '600',
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FAFAFA',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  topicSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#A1A1AA',
    marginBottom: 10,
  },
  topicSummary: {
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#1E1E24',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  readMoreText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717A',
    fontSize: 14,
  },
});

export default LearnScreen;
