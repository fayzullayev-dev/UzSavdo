import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Switch, Image 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, User, Shield, Bell, Globe, HelpCircle, 
  LogOut, Star, Edit3, ChevronRight 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/lib/auth';
import { useI18n } from '../src/lib/i18n';
import { ConfirmSheet } from '../src/components/ConfirmSheet';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();

  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      {/* Top Header with Back button */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Profil' : 'Профиль'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.firstName?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.companyName}>
            {user?.companyName || '«Samarqand Agro Fayz» MChJ'}
          </Text>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName || 'Usmonov'}
          </Text>
          <View style={styles.ratingBadge}>
            <Star size={14} color={COLORS.light.accent} fill={COLORS.light.accent} />
            <Text style={styles.ratingText}>4.9 (24 ta baho)</Text>
          </View>
        </View>

        {/* Section: Shaxsiy ma'lumotlar */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {locale === 'uz' ? 'Shaxsiy maʼlumotlar' : 'Личные данные'}
          </Text>
          <View style={styles.row}>
            <Text style={styles.rowKey}>{locale === 'uz' ? 'Telefon:' : 'Телефон:'}</Text>
            <Text style={styles.rowVal}>{user?.phone || '+998 (90) 000-00-01'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowKey}>{locale === 'uz' ? 'Login:' : 'Логин:'}</Text>
            <Text style={styles.rowVal}>@{user?.login || 'demo'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowKey}>{locale === 'uz' ? 'Parol:' : 'Пароль:'}</Text>
            <Text style={styles.rowVal}>••••••••</Text>
          </View>
        </View>

        {/* Section: Xavfsizlik va Sozlamalar */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {locale === 'uz' ? 'Xavfsizlik va Bildirishnomalar' : 'Безопасность и Уведомления'}
          </Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {locale === 'uz' ? 'Push-bildirishnomalar' : 'Push-уведомления'}
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: COLORS.light.border, true: COLORS.light.primary }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {locale === 'uz' ? 'Face ID / Barmoq izi bilan kirish' : 'Вход по биометрии'}
            </Text>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: COLORS.light.border, true: COLORS.light.primary }}
            />
          </View>
        </View>

        {/* Section: Til */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>
            {locale === 'uz' ? 'Ilova tili' : 'Язык приложения'}
          </Text>
          <View style={styles.langSwitch}>
            <TouchableOpacity
              onPress={() => setLocale('uz')}
              style={[styles.langBtn, locale === 'uz' && styles.langBtnActive]}
            >
              <Text style={[styles.langBtnText, locale === 'uz' && styles.langBtnTextActive]}>
                Oʻzbekcha
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLocale('ru')}
              style={[styles.langBtn, locale === 'ru' && styles.langBtnActive]}
            >
              <Text style={[styles.langBtnText, locale === 'ru' && styles.langBtnTextActive]}>
                Русский
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => setLogoutConfirm(true)}
          style={styles.logoutBtn}
        >
          <LogOut size={18} color={COLORS.light.danger} />
          <Text style={styles.logoutBtnText}>
            {locale === 'uz' ? 'Hisobdan chiqish' : 'Выйти из аккаунта'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Logout */}
      <ConfirmSheet
        visible={logoutConfirm}
        isDanger
        title={locale === 'uz' ? 'Hisobdan chiqish' : 'Выход из аккаунта'}
        description={locale === 'uz' ? 'Haqiqatan ham chiqmoqchimisiz?' : 'Вы действительно хотите выйти?'}
        confirmText={locale === 'uz' ? 'Chiqish' : 'Выйти'}
        cancelText={locale === 'uz' ? 'Bekor qilish' : 'Отмена'}
        onConfirm={async () => {
          setLogoutConfirm(false);
          await logout();
          router.replace('/auth');
        }}
        onCancel={() => setLogoutConfirm(false)}
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
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.light.primary,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.text,
    textAlign: 'center',
  },
  userName: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.light.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.light.accent,
  },
  sectionCard: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  rowKey: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
  },
  rowVal: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 13,
    color: COLORS.light.text,
    fontWeight: '500',
  },
  langSwitch: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 12,
    padding: 4,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  langBtnActive: {
    backgroundColor: COLORS.light.primary,
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  langBtnTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  logoutBtn: {
    height: 50,
    backgroundColor: '#FDECEC',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.danger,
  },
});
