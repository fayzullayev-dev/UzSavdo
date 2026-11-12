import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, TrendingUp, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useI18n } from '../../src/lib/i18n';
import { apiRequest } from '../../src/lib/api';

export default function SalesHistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [sales, setSales] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await apiRequest('/orders');
      if (res.data) setSales(res.data.items || res.data);
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
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Sotuvlar tarixi' : 'История продаж'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadData(); }} colors={[COLORS.light.primary]} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
              <View style={styles.statusBadge}>
                <CheckCircle2 size={12} color={COLORS.light.success} />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.listing?.title || 'Sotilgan tovar'}</Text>
            <Text style={styles.amount}>
              {Number(item.quantity || 100).toLocaleString()} {item.listing?.unit || 'kg'} • {Number(item.listing?.pricePerUnit || 10000).toLocaleString()} soʻm
            </Text>

            <View style={styles.footer}>
              <Text style={styles.seller}>
                {locale === 'uz' ? 'Xaridor: ' : 'Покупатель: '}
                <Text style={styles.bold}>{item.buyer?.companyName || '«Samarqand Agro» MChJ'}</Text>
              </Text>
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
    marginBottom: 8,
  },
  date: {
    fontSize: 11,
    color: COLORS.light.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.light.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 4,
  },
  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.primary,
    marginBottom: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    paddingTop: 8,
  },
  seller: {
    fontSize: 11,
    color: COLORS.light.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.light.text,
  },
});
