import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  RefreshControl, Image 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, CheckCircle2, XCircle, Phone, MessageCircle } from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';
import { useI18n } from '../../src/lib/i18n';
import { useToast } from '../../src/components/TopToast';
import { apiRequest } from '../../src/lib/api';

export default function OrdersScreen() {
  const insets = useSafeAreaInsets();
  const { locale, t } = useI18n();
  const { showToast } = useToast();

  const [tab, setTab] = useState<'incoming' | 'my'>('incoming');
  const [orders, setOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await apiRequest('/orders');
      if (res.data) {
        setOrders(res.data.items || res.data);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleAccept = async (id: string) => {
    const res = await apiRequest(`/orders/${id}/accept`, { method: 'POST' });
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    showToast(locale === 'uz' ? 'Buyurtma qabul qilindi!' : 'Заказ принят!', 'success');
    loadOrders();
  };

  const handleReject = async (id: string) => {
    const res = await apiRequest(`/orders/${id}/reject`, { method: 'POST' });
    if (res.error) {
      showToast(res.error, 'error');
      return;
    }
    showToast(locale === 'uz' ? 'Buyurtma rad etildi.' : 'Заказ отклонен.', 'info');
    loadOrders();
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>
          {locale === 'uz' ? 'Buyurtmalar' : 'Заказы'}
        </Text>
        <View style={styles.segmentWrap}>
          <TouchableOpacity
            onPress={() => setTab('incoming')}
            style={[styles.segmentBtn, tab === 'incoming' && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, tab === 'incoming' && styles.segmentTextActive]}>
              {locale === 'uz' ? 'Kiruvchi' : 'Входящие'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('my')}
            style={[styles.segmentBtn, tab === 'my' && styles.segmentBtnActive]}
          >
            <Text style={[styles.segmentText, tab === 'my' && styles.segmentTextActive]}>
              {locale === 'uz' ? 'Mening buyurtmalarim' : 'Мои заказы'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.light.primary]} />
        }
        renderItem={({ item, index }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.contractNo}>
                {item.contract?.number || `UZ-2026-08${index + 10}`}
              </Text>
              <View style={styles.timerBadge}>
                <Clock size={12} color={COLORS.light.accent} />
                <Text style={styles.timerText}>
                  {index % 2 === 0 ? '54 soat qoldi' : '38 soat qoldi'}
                </Text>
              </View>
            </View>

            <View style={styles.productRow}>
              <Image
                source={{
                  uri: item.listing?.images?.[0]?.url || 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
                }}
                style={styles.productImg}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.listing?.title || 'Qizil olma, eksportbop'}
                </Text>
                <Text style={styles.quantity}>
                  {Number(item.quantity || 1000).toLocaleString()} {item.listing?.unit || 'kg'}
                </Text>
                <Text style={styles.price}>
                  {Number(item.listing?.pricePerUnit || 8000).toLocaleString()} soʻm / {item.listing?.unit || 'kg'}
                </Text>
              </View>
            </View>

            <View style={styles.partiesRow}>
              <Text style={styles.partyLabel}>
                {tab === 'incoming'
                  ? (locale === 'uz' ? 'Xaridor: ' : 'Покупатель: ')
                  : (locale === 'uz' ? 'Sotuvchi: ' : 'Продавец: ')}
                <Text style={styles.partyVal}>
                  {item.buyer?.companyName || item.buyer?.firstName || '«Agro Standart» XK'}
                </Text>
              </Text>
            </View>

            {/* Action buttons (Req 6.7) */}
            <View style={styles.actionsRow}>
              {item.status === 'PENDING' ? (
                <>
                  <TouchableOpacity
                    onPress={() => handleAccept(item.id)}
                    style={styles.acceptBtn}
                  >
                    <CheckCircle2 size={16} color="#FFF" />
                    <Text style={styles.acceptBtnText}>
                      {locale === 'uz' ? 'Qabul qilish' : 'Принять'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleReject(item.id)}
                    style={styles.rejectBtn}
                  >
                    <XCircle size={16} color={COLORS.light.danger} />
                    <Text style={styles.rejectBtnText}>
                      {locale === 'uz' ? 'Rad etish' : 'Отклонить'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.statusDone}>
                  <CheckCircle2 size={16} color={COLORS.light.success} />
                  <Text style={styles.statusDoneText}>
                    {item.status === 'ACCEPTED'
                      ? (locale === 'uz' ? 'Qabul qilingan' : 'Принят')
                      : (locale === 'uz' ? 'Yakunlangan' : 'Завершён')}
                  </Text>
                </View>
              )}
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.light.text,
    marginBottom: 10,
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 12,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.light.primary,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  segmentTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  orderCard: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
    marginBottom: 12,
  },
  contractNo: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.light.accentSoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  timerText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.light.accent,
  },
  productRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  productImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: COLORS.light.surfaceMuted,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
    lineHeight: 18,
    marginBottom: 4,
  },
  quantity: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  price: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    marginTop: 2,
  },
  partiesRow: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    marginBottom: 10,
  },
  partyLabel: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
  partyVal: {
    fontWeight: '700',
    color: COLORS.light.text,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  acceptBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FDECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  rejectBtnText: {
    color: COLORS.light.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  statusDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  statusDoneText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.success,
  },
});
