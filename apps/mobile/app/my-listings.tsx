import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Edit, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';
import { apiRequest } from '../src/lib/api';

export default function MyListingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [listings, setListings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await apiRequest('/listings?my=true');
      if (res.data) setListings(res.data.items || res.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Mening eʼlonlarim' : 'Мои объявления'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} colors={[COLORS.light.primary]} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.status}>{item.status}</Text>
            </View>

            <Text style={styles.price}>
              {Number(item.pricePerUnit).toLocaleString()} soʻm / {item.unit}
            </Text>
            <Text style={styles.stock}>
              {locale === 'uz' ? 'Qoldiq: ' : 'Остаток: '}
              {Number(item.totalQuantity).toLocaleString()} {item.unit}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => router.push(`/listing/${item.id}` as any)}
                style={styles.actionBtn}
              >
                <Text style={styles.actionText}>{locale === 'uz' ? 'Koʻrish' : 'Просмотр'}</Text>
              </TouchableOpacity>
            </View>
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
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.light.text,
    flex: 1,
    marginRight: 10,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.light.primary,
    backgroundColor: COLORS.light.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  stock: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    paddingTop: 10,
  },
  actionBtn: {
    backgroundColor: COLORS.light.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.text,
  },
});
