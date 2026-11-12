import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Phone, Send, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const faqs = [
    {
      qUz: 'Mahsulot shartnomasi qanday rasmiylashtiriladi?',
      qRu: 'Как оформляется договор на товар?',
      aUz: 'Eʼlonda kerakli miqdorni belgilab «Sotib olish» tugmasini bosing va shartnomani tasdiqlang.',
      aRu: 'Укажите количество в объявлении, нажмите «Купить» и подтвердите условия договора.',
    },
    {
      qUz: 'Sinov davrida toʻlov olinadimi?',
      qRu: 'Взимается ли оплата в пробный период?',
      aUz: 'Yoʻq, 10.01.2027 yilgacha tuzilgan barcha shartnomalar bepul rasmiylashtiriladi (0%).',
      aRu: 'Нет, до 10.01.2027 все договоры оформляются бесплатно без комиссии (0%).',
    },
    {
      qUz: 'Buyurtmani qabul qilish muddati qancha?',
      qRu: 'Каков срок ответа на заказ?',
      aUz: 'Sotuvchi buyurtmaga 72 soat ichida javob berishi (qabul qilishi yoki rad etishi) shart.',
      aRu: 'Продавец обязан принять или отклонить заказ в течение 72 часов.',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Yordam va FAQ' : 'Помощь и FAQ'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.supportBox}>
          <Text style={styles.supportTitle}>
            {locale === 'uz' ? 'Qoʻllab-quvvatlash xizmati' : 'Служба поддержки'}
          </Text>
          <Text style={styles.supportDesc}>
            {locale === 'uz' ? 'Savollaringiz bormi? Mutaxassislarimiz yordam berishga tayyor.' : 'Возникли вопросы? Наши специалисты готовы помочь.'}
          </Text>
          <View style={styles.supportBtns}>
            <TouchableOpacity style={styles.callBtn}>
              <Phone size={16} color="#FFF" />
              <Text style={styles.callBtnText}>+998 (71) 200-00-00</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.faqHeading}>
          {locale === 'uz' ? 'Koʻp beriladigan savollar' : 'Часто задаваемые вопросы'}
        </Text>

        {faqs.map((f, idx) => (
          <View key={idx} style={styles.faqCard}>
            <Text style={styles.faqQ}>{locale === 'uz' ? f.qUz : f.qRu}</Text>
            <Text style={styles.faqA}>{locale === 'uz' ? f.aUz : f.aRu}</Text>
          </View>
        ))}
      </ScrollView>
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
  },
  supportBox: {
    backgroundColor: COLORS.light.primarySoft,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.light.primary,
    marginBottom: 4,
  },
  supportDesc: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
    marginBottom: 16,
    lineHeight: 18,
  },
  supportBtns: {
    flexDirection: 'row',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  callBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  faqHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 12,
  },
  faqCard: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 12,
  },
  faqQ: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 6,
  },
  faqA: {
    fontSize: 13,
    color: COLORS.light.textSecondary,
    lineHeight: 19,
  },
});
