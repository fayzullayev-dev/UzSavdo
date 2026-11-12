import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';
import { apiRequest } from '../src/lib/api';
import { ListingCard } from '../src/components/ListingCard';

const { width } = Dimensions.get('window');

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    apiRequest('/listings?limit=4').then((res) => {
      if (res.data) setListings(res.data.items || res.data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Saralanganlar' : 'Избранное'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.colWrapper}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.col}>
            <ListingCard
              item={item}
              locale={locale}
              isFavorite={true}
              onPress={() => router.push(`/listing/${item.id}` as any)}
            />
          </View>
        )}
      />
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
  list: {
    padding: 12,
  },
  colWrapper: {
    justifyContent: 'space-between',
  },
  col: {
    width: (width - 32) / 2,
  },
});
