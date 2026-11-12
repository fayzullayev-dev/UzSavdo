import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  Dimensions, TextInput 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, Heart, Share2, Star, CheckCircle2, 
  Lock, Phone, MessageCircle, FileText, Minus, Plus 
} from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';
import { useI18n } from '../../src/lib/i18n';
import { useToast } from '../../src/components/TopToast';
import { apiRequest } from '../../src/lib/api';
import { FormSheet } from '../../src/components/FormSheet';

const { width } = Dimensions.get('window');

export default function ListingDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { locale, t } = useI18n();
  const { showToast } = useToast();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState('100');
  const [buySheetVisible, setBuySheetVisible] = useState(false);
  const [contractCreated, setContractCreated] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiRequest(`/listings/${id}`).then((res) => {
      if (res.data) setListing(res.data);
      setLoading(false);
    });
  }, [id]);

  if (loading || !listing) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>
          {locale === 'uz' ? 'Yuklanmoqda...' : 'Загрузка...'}
        </Text>
      </View>
    );
  }

  const title = locale === 'ru' && listing.titleRu ? listing.titleRu : listing.title;
  const price = Number(listing.pricePerUnit || 1000);
  const totalAmount = price * (Number(quantity) || 0);
  const imageUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800';

  const handleCreateContract = async () => {
    const res = await apiRequest('/contracts', {
      method: 'POST',
      body: JSON.stringify({
        listingId: listing.id,
        quantity: Number(quantity),
      }),
    });

    if (res.error) {
      showToast(res.error, 'error');
      return;
    }

    setContractCreated(res.data);
    showToast(
      locale === 'uz' ? 'Shartnoma rasmiylashtirildi!' : 'Договор успешно оформлен!',
      'success'
    );
  };

  return (
    <View style={styles.container}>
      {/* 6.3 Photo Gallery header */}
      <View style={styles.gallery}>
        <Image source={{ uri: imageUrl }} style={styles.galleryImg} resizeMode="cover" />

        {/* Floating actions over image */}
        <View style={[styles.floatingBar, { top: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
            <ArrowLeft size={20} color={COLORS.light.text} />
          </TouchableOpacity>
          <View style={styles.rightFloat}>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.circleBtn}>
              <Heart
                size={20}
                color={isFavorite ? COLORS.light.danger : COLORS.light.text}
                fill={isFavorite ? COLORS.light.danger : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content Card overlapping gallery */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>
            {price.toLocaleString()} soʻm{' '}
            <Text style={styles.unit}>/ 1 {listing.unit || 'kg'} uchun</Text>
          </Text>

          <View style={styles.stockRow}>
            <Text style={styles.stockText}>
              {locale === 'uz' ? 'Mavjud: ' : 'В наличии: '}
              <Text style={styles.stockVal}>
                {Number(listing.totalQuantity || 1000).toLocaleString()} {listing.unit || 'kg'}
              </Text>
            </Text>
          </View>

          {/* Specifications block */}
          <View style={styles.specsBox}>
            <Text style={styles.sectionHeading}>
              {locale === 'uz' ? 'Xususiyatlar' : 'Характеристики'}
            </Text>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{locale === 'uz' ? 'Kategoriya' : 'Категория'}:</Text>
              <Text style={styles.specVal}>
                {locale === 'ru' && listing.category?.nameRu ? listing.category.nameRu : listing.category?.nameUz}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{locale === 'uz' ? 'Hudud' : 'Регион'}:</Text>
              <Text style={styles.specVal}>
                {listing.district?.nameUz || listing.region?.nameUz || 'Toshkent shahri'}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specKey}>{locale === 'uz' ? 'Yetkazib berish' : 'Доставка'}:</Text>
              <Text style={styles.specVal}>
                {listing.delivery || (locale === 'uz' ? 'Kelishuv asosida' : 'По договоренности')}
              </Text>
            </View>
          </View>

          {/* Seller info box (locked until contract) */}
          <View style={styles.sellerBox}>
            <Text style={styles.sectionHeading}>
              {locale === 'uz' ? 'Sotuvchi haqida' : 'О продавце'}
            </Text>
            <View style={styles.sellerLocked}>
              <Lock size={20} color={COLORS.light.primary} />
              <Text style={styles.sellerLockText}>
                {locale === 'uz'
                  ? 'Sotuvchi maʼlumotlari mahsulot shartnomasi rasmiylashtirilgandan soʻng koʻrinadi'
                  : 'Контакты продавца откроются после оформления договора'}
              </Text>
            </View>
            <View style={styles.sellerStats}>
              <View style={styles.sellerStat}>
                <Star size={14} color={COLORS.light.accent} fill={COLORS.light.accent} />
                <Text style={styles.statVal}>4.9 (24)</Text>
              </View>
              <View style={styles.sellerStat}>
                <CheckCircle2 size={14} color={COLORS.light.success} />
                <Text style={styles.statVal}>98% javob berish</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 6.3 Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 10 }]}>
        <View style={styles.calcCol}>
          <Text style={styles.calcLabel}>
            {locale === 'uz' ? 'Kerakli miqdor:' : 'Количество:'}
          </Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              onPress={() => setQuantity(String(Math.max(1, Number(quantity) - 10)))}
              style={styles.qtyBtn}
            >
              <Minus size={16} color={COLORS.light.text} />
            </TouchableOpacity>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.qtyInput}
            />
            <TouchableOpacity
              onPress={() => setQuantity(String(Number(quantity) + 10))}
              style={styles.qtyBtn}
            >
              <Plus size={16} color={COLORS.light.text} />
            </TouchableOpacity>
            <Text style={styles.qtyUnit}>{listing.unit || 'kg'}</Text>
          </View>
          <Text style={styles.estAmount} numberOfLines={1}>
            {totalAmount.toLocaleString()} soʻm
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setBuySheetVisible(true)}
          style={styles.buyBtn}
        >
          <Text style={styles.buyBtnText}>
            {locale === 'uz' ? 'Sotib olish' : 'Купить'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 6.4 Bottom Sheet for purchase / contract creation */}
      <FormSheet
        visible={buySheetVisible}
        title={
          contractCreated
            ? (locale === 'uz' ? 'Shartnoma rasmiylashtirildi!' : 'Договор оформлен!')
            : (locale === 'uz' ? 'Buyurtmani rasmiylashtirish' : 'Оформление покупки')
        }
        onClose={() => {
          setBuySheetVisible(false);
          setContractCreated(null);
        }}
      >
        {!contractCreated ? (
          <View style={styles.sheetContent}>
            <Text style={styles.sheetProductTitle}>{title}</Text>
            <Text style={styles.sheetQuantity}>
              {quantity} {listing.unit || 'kg'} • {totalAmount.toLocaleString()} soʻm
            </Text>

            <View style={styles.freeTrialBox}>
              <CheckCircle2 size={18} color={COLORS.light.success} />
              <Text style={styles.freeTrialText}>
                {locale === 'uz'
                  ? 'Sinov davrida mahsulot shartnomasi bepul (0% komissiya)'
                  : 'В пробный период договор оформляется бесплатно (0%)'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleCreateContract}
              style={styles.confirmContractBtn}
            >
              <Text style={styles.confirmContractText}>
                {locale === 'uz' ? 'Shartnomani tasdiqlash' : 'Подтвердить договор'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sheetSuccess}>
            <View style={styles.successIconBox}>
              <CheckCircle2 size={44} color={COLORS.light.success} />
            </View>
            <Text style={styles.successNumber}>
              № {contractCreated.number || 'UZ-2026-0814'}
            </Text>
            <Text style={styles.successHint}>
              {locale === 'uz'
                ? 'Sotuvchi bilan bogʻlanish uchun maʼlumotlar ochildi:'
                : 'Контакты продавца для связи:'}
            </Text>

            <View style={styles.sellerCard}>
              <Text style={styles.sellerNameBold}>
                {listing.seller?.companyName || '«Agro Star Fayz» MChJ'}
              </Text>
              <Text style={styles.sellerPhone}>+998 (90) 123-45-67</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setBuySheetVisible(false);
                router.push('/(tabs)/orders');
              }}
              style={styles.sendOrderBtn}
            >
              <Text style={styles.sendOrderText}>
                {locale === 'uz' ? 'Buyurtmani sotuvchiga yuborish' : 'Отправить заказ продавцу'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </FormSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
  },
  gallery: {
    width: '100%',
    height: width * 0.75,
    position: 'relative',
    backgroundColor: COLORS.light.surfaceMuted,
  },
  galleryImg: {
    width: '100%',
    height: '100%',
  },
  floatingBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightFloat: {
    flexDirection: 'row',
    gap: 8,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  contentCard: {
    backgroundColor: COLORS.light.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.light.text,
    lineHeight: 26,
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.light.primary,
  },
  unit: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.light.textSecondary,
  },
  stockRow: {
    marginTop: 6,
    marginBottom: 16,
  },
  stockText: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
  },
  stockVal: {
    fontWeight: '700',
    color: COLORS.light.text,
  },
  specsBox: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  specKey: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  sellerBox: {
    padding: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  sellerLocked: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingVertical: 6,
  },
  sellerLockText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.light.textSecondary,
    lineHeight: 16,
  },
  sellerStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  sellerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.light.surface,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 8,
  },
  calcCol: {
    flex: 1,
    marginRight: 12,
  },
  calcLabel: {
    fontSize: 11,
    color: COLORS.light.textSecondary,
    marginBottom: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyInput: {
    width: 60,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.light.surfaceMuted,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  qtyUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  estAmount: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.light.primary,
    marginTop: 4,
  },
  buyBtn: {
    height: 48,
    paddingHorizontal: 28,
    borderRadius: 14,
    backgroundColor: COLORS.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  sheetContent: {
    paddingVertical: 10,
  },
  sheetProductTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 4,
  },
  sheetQuantity: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.primary,
    marginBottom: 16,
  },
  freeTrialBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.light.primarySoft,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  freeTrialText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.primary,
  },
  confirmContractBtn: {
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmContractText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  sheetSuccess: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  successIconBox: {
    marginBottom: 10,
  },
  successNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.light.primary,
  },
  successHint: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    marginVertical: 10,
  },
  sellerCard: {
    width: '100%',
    padding: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  sellerNameBold: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  sellerPhone: {
    fontSize: 13,
    color: COLORS.light.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  sendOrderBtn: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendOrderText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
