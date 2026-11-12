import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Image, RefreshControl, Dimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Eye, EyeOff, Sparkles, ShoppingBasket, Package, ClipboardList, 
  FileText, MessageCircle, Heart, ShoppingBag, TrendingUp, Star, 
  Search, Bell, ChevronRight, Layers 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useAuth } from '../../src/lib/auth';
import { useI18n } from '../../src/lib/i18n';
import { apiRequest } from '../../src/lib/api';
import { ListingCard } from '../../src/components/ListingCard';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { locale, t } = useI18n();

  const [refreshing, setRefreshing] = useState(false);
  const [showAmount, setShowAmount] = useState(true);
  const [summaryMode, setSummaryMode] = useState<'sales' | 'purchases' | 'contracts'>('sales');

  const [summary, setSummary] = useState<any>({
    totalSalesAmount: 12450000,
    totalPurchasesAmount: 8320000,
    stats: { pendingOrders: 2, activeListings: 4, completedDeals: 5, totalContracts: 6 },
    trialEndsAt: '2027-01-10T00:00:00.000Z',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [recentListings, setRecentListings] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const [sumRes, catRes, listRes] = await Promise.all([
        apiRequest('/me/summary'),
        apiRequest('/categories'),
        apiRequest('/listings?limit=6'),
      ]);

      if (sumRes.data) setSummary(sumRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (listRes.data) setRecentListings(listRes.data.items || listRes.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 9 grid tiles
  const services = [
    { id: 'listings', nameUz: 'Eʼlonlar', nameRu: 'Объявления', icon: ShoppingBasket, route: '/(tabs)/listings' },
    { id: 'myListings', nameUz: 'Mening eʼlonlarim', nameRu: 'Мои объявления', icon: Package, route: '/my-listings' },
    { id: 'orders', nameUz: 'Buyurtmalar', nameRu: 'Заказы', icon: ClipboardList, route: '/(tabs)/orders', badge: 'yangi' },
    { id: 'contracts', nameUz: 'Shartnomalarim', nameRu: 'Мои договоры', icon: FileText, route: '/contracts' },
    { id: 'messages', nameUz: 'Xabarlar', nameRu: 'Сообщения', icon: MessageCircle, route: '/messages' },
    { id: 'favorites', nameUz: 'Saralanganlar', nameRu: 'Избранное', icon: Heart, route: '/favorites' },
    { id: 'purchases', nameUz: 'Xaridlar tarixi', nameRu: 'История покупок', icon: ShoppingBag, route: '/history/purchases' },
    { id: 'sales', nameUz: 'Sotuvlar tarixi', nameRu: 'История продаж', icon: TrendingUp, route: '/history/sales' },
    { id: 'ratings', nameUz: 'Reyting va baholar', nameRu: 'Рейтинг и отзывы', icon: Star, route: '/ratings' },
  ];

  return (
    <View style={styles.container}>
      {/* 4.1 Top App Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <TouchableOpacity
          onPress={() => router.push('/profile')}
          style={styles.avatarBtn}
        >
          <Text style={styles.avatarText}>
            {(user?.firstName?.[0] || 'U').toUpperCase()}
          </Text>
        </TouchableOpacity>

        <View style={styles.brandTitle}>
          <Text style={styles.brandText}>UzSavdo</Text>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/listings')}
            style={styles.iconBtn}
          >
            <Search size={20} color={COLORS.light.text} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={styles.iconBtn}
          >
            <Bell size={20} color={COLORS.light.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.light.primary]} />
        }
      >
        {/* 5.1 White Summary Block */}
        <View style={styles.summaryCard}>
          <TouchableOpacity
            onPress={() => router.push('/history/sales')}
            style={styles.summaryTitleRow}
          >
            <Text style={styles.summaryTitle}>
              {summaryMode === 'sales'
                ? (locale === 'uz' ? 'Jami savdolarim' : 'Мои продажи всего')
                : summaryMode === 'purchases'
                ? (locale === 'uz' ? 'Jami xaridlarim' : 'Мои покупки всего')
                : (locale === 'uz' ? 'Shartnomalarim soni' : 'Мои договоры')}
            </Text>
            <ChevronRight size={16} color={COLORS.light.textSecondary} />
          </TouchableOpacity>

          <View style={styles.amountRow}>
            <Text style={styles.amountText}>
              {showAmount
                ? summaryMode === 'sales'
                  ? `${summary.totalSalesAmount?.toLocaleString()} soʻm`
                  : summaryMode === 'purchases'
                  ? `${summary.totalPurchasesAmount?.toLocaleString()} soʻm`
                  : `${summary.stats?.totalContracts || 6} ta`
                : '••••••••'}
            </Text>
            <TouchableOpacity onPress={() => setShowAmount(!showAmount)} style={styles.eyeBtn}>
              {showAmount ? (
                <Eye size={20} color={COLORS.light.textSecondary} />
              ) : (
                <EyeOff size={20} color={COLORS.light.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Horizontally scrollable mini cards */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.miniCardsScroll}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>{locale === 'uz' ? 'Kutilmoqda' : 'Ожидают'}</Text>
              <Text style={[styles.miniVal, { color: COLORS.light.accent }]}>
                {summary.stats?.pendingOrders || 2} ta
              </Text>
            </View>

            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>{locale === 'uz' ? 'Faol eʼlonlar' : 'Активные'}</Text>
              <Text style={[styles.miniVal, { color: COLORS.light.primary }]}>
                {summary.stats?.activeListings || 4} ta
              </Text>
            </View>

            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>{locale === 'uz' ? 'Yakunlangan' : 'Завершено'}</Text>
              <Text style={[styles.miniVal, { color: COLORS.light.success }]}>
                {summary.stats?.completedDeals || 5} ta
              </Text>
            </View>

            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>{locale === 'uz' ? 'Shartnomalar' : 'Договоры'}</Text>
              <Text style={[styles.miniVal, { color: COLORS.light.text }]}>
                {summary.stats?.totalContracts || 6} ta
              </Text>
            </View>
          </ScrollView>

          {/* 3 Circular Mode Switchers (half sticking out) */}
          <View style={styles.capsuleWrap}>
            <View style={styles.capsule}>
              <TouchableOpacity
                onPress={() => setSummaryMode('sales')}
                style={[styles.modeCircle, summaryMode === 'sales' && styles.modeCircleActive]}
              >
                <TrendingUp
                  size={24}
                  color={summaryMode === 'sales' ? COLORS.light.primary : COLORS.light.textMuted}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSummaryMode('purchases')}
                style={[styles.modeCircle, summaryMode === 'purchases' && styles.modeCircleActive]}
              >
                <ShoppingBag
                  size={24}
                  color={summaryMode === 'purchases' ? COLORS.light.primary : COLORS.light.textMuted}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSummaryMode('contracts')}
                style={[styles.modeCircle, summaryMode === 'contracts' && styles.modeCircleActive]}
              >
                <FileText
                  size={24}
                  color={summaryMode === 'contracts' ? COLORS.light.primary : COLORS.light.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 5.2 Trial Period Promo banner */}
        <View style={styles.promoBanner}>
          <Sparkles size={20} color={COLORS.light.accent} />
          <Text style={styles.promoText}>
            {locale === 'uz'
              ? 'Sinov davri: mahsulot shartnomalari 10.01.2027 gacha bepul'
              : 'Пробный период: договоры на товары бесплатны до 10.01.2027'}
          </Text>
        </View>

        {/* 5.3 Xizmatlar 3x3 Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{locale === 'uz' ? 'Xizmatlar' : 'Разделы'}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
            <Text style={styles.seeAll}>{locale === 'uz' ? 'Hammasi ›' : 'Все ›'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <TouchableOpacity
                key={srv.id}
                activeOpacity={0.8}
                onPress={() => router.push(srv.route as any)}
                style={styles.gridTile}
              >
                {srv.badge && (
                  <View style={styles.tileBadge}>
                    <Text style={styles.tileBadgeText}>yangi</Text>
                  </View>
                )}
                <View style={styles.tileIcon}>
                  <Icon size={28} color={COLORS.light.primary} />
                </View>
                <Text style={styles.tileTitle} numberOfLines={2}>
                  {locale === 'uz' ? srv.nameUz : srv.nameRu}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 5.4 Categories Horizontal Scroll */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{locale === 'uz' ? 'Kategoriyalar' : 'Категории'}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
            <Text style={styles.seeAll}>{locale === 'uz' ? 'Hammasi ›' : 'Все ›'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.id || idx}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/listings?category=${cat.id}` as any)}
              style={styles.catItem}
            >
              <View style={styles.catCircle}>
                <Layers size={26} color={COLORS.light.primary} />
              </View>
              <Text style={styles.catTitle} numberOfLines={2}>
                {locale === 'uz' ? cat.nameUz : cat.nameRu}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 5.5 Recent Listings Horizontal Scroll */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{locale === 'uz' ? 'Soʻnggi eʼlonlar' : 'Последние объявления'}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/listings')}>
            <Text style={styles.seeAll}>{locale === 'uz' ? 'Hammasi ›' : 'Все ›'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.listingsScroll}>
          {recentListings.map((item, idx) => (
            <View key={item.id || idx} style={styles.listingSlide}>
              <ListingCard
                item={item}
                locale={locale}
                onPress={() => router.push(`/listing/${item.id}` as any)}
              />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  topBar: {
    backgroundColor: COLORS.light.surface,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  brandTitle: {
    flex: 1,
    alignItems: 'center',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.light.primary,
    letterSpacing: -0.5,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.light.danger,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  summaryCard: {
    backgroundColor: COLORS.light.surface,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 42,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 16,
  },
  amountText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.light.text,
  },
  eyeBtn: {
    padding: 4,
  },
  miniCardsScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  miniCard: {
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 10,
    minWidth: 120,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
    marginBottom: 4,
  },
  miniVal: {
    fontSize: 18,
    fontWeight: '700',
  },
  capsuleWrap: {
    position: 'absolute',
    bottom: -28,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  capsule: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.surface,
    borderRadius: 40,
    padding: 6,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  modeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeCircleActive: {
    backgroundColor: COLORS.light.surface,
    borderWidth: 2,
    borderColor: COLORS.light.primary,
  },
  promoBanner: {
    marginTop: 44,
    marginHorizontal: 16,
    backgroundColor: COLORS.light.accentSoft,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#F7D9C4',
  },
  promoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#8A4116',
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  gridTile: {
    width: (width - 40) / 3,
    backgroundColor: COLORS.light.surface,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tileBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.light.accent,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  tileBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  tileIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.text,
    textAlign: 'center',
  },
  categoriesScroll: {
    paddingLeft: 16,
  },
  catItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 68,
  },
  catCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.light.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  listingsScroll: {
    paddingLeft: 16,
  },
  listingSlide: {
    width: width * 0.68,
    marginRight: 12,
  },
});
