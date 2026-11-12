import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ShoppingBasket, Package, ClipboardList, FileText, MessageCircle, 
  Heart, ShoppingBag, TrendingUp, Star, HelpCircle, User, LogOut, 
  ChevronRight, X, Globe, Sun, Moon 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/theme';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';

interface RightMenuDrawerProps {
  visible: boolean;
  onClose: () => void;
  onOpenConfirmLogout: () => void;
}

export function RightMenuDrawer({ visible, onClose, onOpenConfirmLogout }: RightMenuDrawerProps) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  if (!visible) return null;

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const menuSections = [
    {
      titleUz: 'Savdo',
      titleRu: 'Торговля',
      items: [
        { id: 'listings', nameUz: 'Eʼlonlar', nameRu: 'Объявления', icon: ShoppingBasket, route: '/(tabs)/listings' },
        { id: 'newListing', nameUz: 'Eʼlon joylash', nameRu: 'Разместить объявление', icon: Package, route: '/(tabs)/new-listing' },
        { id: 'myListings', nameUz: 'Mening eʼlonlarim', nameRu: 'Мои объявления', icon: Package, route: '/my-listings' },
        { id: 'orders', nameUz: 'Buyurtmalar', nameRu: 'Заказы', icon: ClipboardList, route: '/(tabs)/orders' },
        { id: 'contracts', nameUz: 'Shartnomalarim', nameRu: 'Мои договоры', icon: FileText, route: '/contracts' },
      ],
    },
    {
      titleUz: 'Muloqot',
      titleRu: 'Общение',
      items: [
        { id: 'messages', nameUz: 'Xabarlar', nameRu: 'Сообщения', icon: MessageCircle, route: '/messages' },
        { id: 'notifications', nameUz: 'Bildirishnomalar', nameRu: 'Уведомления', icon: Star, route: '/notifications' },
      ],
    },
    {
      titleUz: 'Tarix',
      titleRu: 'История',
      items: [
        { id: 'purchases', nameUz: 'Xaridlar tarixi', nameRu: 'История покупок', icon: ShoppingBag, route: '/history/purchases' },
        { id: 'sales', nameUz: 'Sotuvlar tarixi', nameRu: 'История продаж', icon: TrendingUp, route: '/history/sales' },
      ],
    },
    {
      titleUz: 'Boshqa',
      titleRu: 'Прочее',
      items: [
        { id: 'favorites', nameUz: 'Saralanganlar', nameRu: 'Избранное', icon: Heart, route: '/favorites' },
        { id: 'ratings', nameUz: 'Reyting va baholar', nameRu: 'Рейтинг и отзывы', icon: Star, route: '/ratings' },
        { id: 'help', nameUz: 'Yordam', nameRu: 'Помощь', icon: HelpCircle, route: '/help' },
      ],
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.drawer, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
          {/* Header User Card */}
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(user?.firstName?.[0] || 'U').toUpperCase()}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.companyName} numberOfLines={1}>
                {user?.companyName || '«UzSavdo» Hamkori'}
              </Text>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.firstName} {user?.lastName}
              </Text>
              <View style={styles.ratingBadge}>
                <Star size={11} color={COLORS.light.accent} fill={COLORS.light.accent} />
                <Text style={styles.ratingText}>4.9 (18)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={COLORS.light.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Scrollable menu items */}
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {menuSections.map((sec, sIdx) => (
              <View key={sIdx} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {locale === 'uz' ? sec.titleUz : sec.titleRu}
                </Text>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => handleNavigate(item.route)}
                      style={styles.menuItem}
                    >
                      <View style={styles.iconCircle}>
                        <Icon size={18} color={COLORS.light.primary} />
                      </View>
                      <Text style={styles.itemText}>
                        {locale === 'uz' ? item.nameUz : item.nameRu}
                      </Text>
                      <ChevronRight size={16} color={COLORS.light.textMuted} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            {/* Language and theme in drawer */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {locale === 'uz' ? 'Tilni tanlash' : 'Язык интерфейса'}
              </Text>
              <View style={styles.langSwitch}>
                <TouchableOpacity
                  onPress={() => setLocale('uz')}
                  style={[styles.langBtn, locale === 'uz' && styles.langBtnActive]}
                >
                  <Text style={[styles.langText, locale === 'uz' && styles.langTextActive]}>
                    Oʻzbekcha
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setLocale('ru')}
                  style={[styles.langBtn, locale === 'ru' && styles.langBtnActive]}
                >
                  <Text style={[styles.langText, locale === 'ru' && styles.langTextActive]}>
                    Русский
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Drawer footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleNavigate('/profile')}
              style={styles.profileBtn}
            >
              <User size={18} color={COLORS.light.text} />
              <Text style={styles.profileBtnText}>{locale === 'uz' ? 'Profil' : 'Профиль'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenConfirmLogout}
              style={styles.logoutBtn}
            >
              <LogOut size={18} color={COLORS.light.danger} />
              <Text style={styles.logoutBtnText}>{locale === 'uz' ? 'Chiqish' : 'Выход'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: '84%',
    maxWidth: 360,
    backgroundColor: COLORS.light.surface,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  userInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  userName: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    marginTop: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.light.accent,
  },
  closeBtn: {
    padding: 6,
  },
  scroll: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.light.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  langSwitch: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 12,
    padding: 4,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  langBtnActive: {
    backgroundColor: COLORS.light.primary,
  },
  langText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  langTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  profileBtn: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  profileBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  logoutBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.danger,
  },
});
