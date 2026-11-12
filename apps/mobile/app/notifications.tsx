import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, CheckCircle2, Package, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';
import { apiRequest } from '../src/lib/api';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    apiRequest('/notifications').then((res) => {
      if (res.data) setNotifications(res.data);
    });
  }, []);

  const demoNotifs = [
    { id: '1', title: 'Yangi buyurtma keldi', desc: 'Sizning «Qizil olma» eʼloningizga yangi buyurtma berildi.', time: '10 daqiqa oldin' },
    { id: '2', title: 'Shartnoma tasdiqlandi', desc: '№ UZ-2026-0814 shartnomasi xaridor tomonidan qabul qilindi.', time: '1 soat oldin' },
    { id: '3', title: 'Tizim xabari', desc: 'Sinov davri doirasida barcha shartnomalar bepul.', time: 'Kecha' },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Bildirishnomalar' : 'Уведомления'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={notifications.length > 0 ? notifications : demoNotifs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Bell size={18} color={COLORS.light.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc || item.payload}</Text>
              <Text style={styles.time}>{item.time || 'Bugun'}</Text>
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
    flexDirection: 'row',
    backgroundColor: COLORS.light.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 10,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 2,
  },
  desc: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    lineHeight: 16,
  },
  time: {
    fontSize: 10,
    color: COLORS.light.textMuted,
    marginTop: 6,
  },
});
