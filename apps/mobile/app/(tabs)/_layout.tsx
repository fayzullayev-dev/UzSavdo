import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Home, ShoppingBasket, Plus, ClipboardList, LayoutGrid } from 'lucide-react-native';
import { COLORS } from '../../src/constants/theme';
import { RightMenuDrawer } from '../../src/components/RightMenuDrawer';
import { ConfirmSheet } from '../../src/components/ConfirmSheet';
import { useAuth } from '../../src/lib/auth';
import { useI18n } from '../../src/lib/i18n';

export default function TabsLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const { logout } = useAuth();
  const { locale, t } = useI18n();

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: COLORS.light.primary,
          tabBarInactiveTintColor: COLORS.light.textMuted,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: locale === 'uz' ? 'Bosh sahifa' : 'Главная',
            tabBarIcon: ({ color, focused }) => (
              <Home size={24} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="listings"
          options={{
            title: locale === 'uz' ? 'Eʼlonlar' : 'Объявления',
            tabBarIcon: ({ color, focused }) => (
              <ShoppingBasket size={24} color={color} />
            ),
          }}
        />

        {/* Central Plus Button (Req 4.2) */}
        <Tabs.Screen
          name="new-listing"
          options={{
            title: '',
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <View style={styles.centerBtn}>
                <Plus size={30} color="#FFFFFF" strokeWidth={2.5} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="orders"
          options={{
            title: locale === 'uz' ? 'Buyurtmalar' : 'Заказы',
            tabBarIcon: ({ color, focused }) => (
              <ClipboardList size={24} color={color} />
            ),
          }}
        />

        {/* 5th button opens Right Drawer Menu */}
        <Tabs.Screen
          name="menu"
          options={{
            title: locale === 'uz' ? 'Menyu' : 'Меню',
            tabBarIcon: ({ color, focused }) => (
              <LayoutGrid size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setMenuOpen(true);
            },
          }}
        />
      </Tabs>

      {/* Right Menu Drawer */}
      <RightMenuDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenConfirmLogout={() => {
          setMenuOpen(false);
          setLogoutConfirm(true);
        }}
      />

      {/* Logout confirmation sheet */}
      <ConfirmSheet
        visible={logoutConfirm}
        isDanger
        title={locale === 'uz' ? 'Hisobdan chiqish' : 'Выход из аккаунта'}
        description={locale === 'uz' ? 'Haqiqatan ham hisobingizdan chiqmoqchimisiz?' : 'Вы действительно хотите выйти из своего аккаунта?'}
        confirmText={locale === 'uz' ? 'Chiqish' : 'Выйти'}
        cancelText={locale === 'uz' ? 'Bekor qilish' : 'Отмена'}
        onConfirm={async () => {
          setLogoutConfirm(false);
          await logout();
        }}
        onCancel={() => setLogoutConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: COLORS.light.surface,
    borderRadius: 28,
    height: 72,
    paddingBottom: Platform.OS === 'ios' ? 12 : 8,
    paddingTop: 8,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  centerBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    borderWidth: 4,
    borderColor: COLORS.light.surface,
    shadowColor: COLORS.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
