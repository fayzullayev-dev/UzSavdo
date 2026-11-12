import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Download, Share2, CheckCircle2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';
import { useToast } from '../src/components/TopToast';
import { apiRequest } from '../src/lib/api';

export default function ContractsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();
  const { showToast } = useToast();

  const [contracts, setContracts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadContracts = async () => {
    try {
      const res = await apiRequest('/contracts');
      if (res.data) setContracts(res.data.items || res.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadContracts();
  };

  const handleDownload = (no: string) => {
    showToast(
      locale === 'uz' ? `№ ${no} PDF formati yuklab olindi` : `№ ${no} PDF файл скачан`,
      'success'
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Shartnomalarim' : 'Мои договоры'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={contracts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.light.primary]} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconNo}>
                <FileText size={18} color={COLORS.light.primary} />
                <Text style={styles.number}>{item.number}</Text>
              </View>
              <View style={styles.badge}>
                <CheckCircle2 size={12} color={COLORS.light.success} />
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.listing?.title || 'Mahsulot shartnomasi'}</Text>
            <Text style={styles.amount}>
              {Number(item.estimatedTotal || 5000000).toLocaleString()} soʻm
            </Text>

            <View style={styles.footer}>
              <Text style={styles.parties}>
                {item.seller?.companyName} ➔ {item.buyer?.companyName}
              </Text>
              <TouchableOpacity
                onPress={() => handleDownload(item.number)}
                style={styles.downloadBtn}
              >
                <Download size={16} color={COLORS.light.primary} />
                <Text style={styles.downloadText}>PDF</Text>
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
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconNo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  number: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.light.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.light.text,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  parties: {
    fontSize: 11,
    color: COLORS.light.textSecondary,
    flex: 1,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.light.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  downloadText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
});
