import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Star, ThumbsUp, MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';

export default function RatingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [tab, setTab] = useState<'my' | 'left'>('my');

  const demoReviews = [
    {
      id: '1',
      rating: 5,
      text: 'Mahsulot sifati juda aʼlo darajada! Vaqtida yuklab joʻnatishdi, rahmat.',
      author: '«Zarafshon Baraka» MChJ',
      date: '10.11.2026',
      reply: 'Xaridingiz uchun tashakkur! Har doim xizmatingizdamiz.',
    },
    {
      id: '2',
      rating: 5,
      text: 'Standartlarga toʻliq javob beradi. Qadoqlash juda mustahkam.',
      author: 'XK «Bekobod Savdo»',
      date: '08.11.2026',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Reyting va baholar' : 'Рейтинг и отзывы'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Rating overview card */}
        <View style={styles.overviewCard}>
          <Text style={styles.bigRating}>4.9</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} color={COLORS.light.accent} fill={COLORS.light.accent} />
            ))}
          </View>
          <Text style={styles.totalReviews}>
            {locale === 'uz' ? '24 ta xaridor baholagan' : '24 оценки от покупателей'}
          </Text>
        </View>

        {/* Reviews list */}
        <Text style={styles.subHeading}>
          {locale === 'uz' ? 'Soʻnggi sharhlar' : 'Последние отзывы'}
        </Text>

        {demoReviews.map((rev) => (
          <View key={rev.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.starsSmall}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    color={COLORS.light.accent}
                    fill={s <= rev.rating ? COLORS.light.accent : 'transparent'}
                  />
                ))}
              </View>
              <Text style={styles.date}>{rev.date}</Text>
            </View>

            <Text style={styles.reviewText}>«{rev.text}»</Text>
            <Text style={styles.author}>{rev.author}</Text>

            {rev.reply && (
              <View style={styles.replyBox}>
                <Text style={styles.replyTitle}>
                  {locale === 'uz' ? 'Sizning javobingiz:' : 'Ваш ответ:'}
                </Text>
                <Text style={styles.replyText}>{rev.reply}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  header: {
    backgroundColor: COLORS.light.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  scroll: {
    padding: 16,
  },
  overviewCard: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 20,
  },
  bigRating: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.light.text,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 6,
  },
  totalReviews: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
    fontWeight: '500',
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 12,
  },
  reviewCard: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  starsSmall: {
    flexDirection: 'row',
    gap: 2,
  },
  date: {
    fontSize: 11,
    color: COLORS.light.textMuted,
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.light.text,
    lineHeight: 18,
    marginBottom: 6,
  },
  author: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  replyBox: {
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  replyTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.light.primary,
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    color: COLORS.light.text,
  },
});
