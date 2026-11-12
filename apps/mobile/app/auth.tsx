import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ScrollView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Eye, EyeOff, Lock, User, Phone, Building } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useAuth } from '../src/lib/auth';
import { useI18n } from '../src/lib/i18n';
import { useToast } from '../src/components/TopToast';
import { apiRequest } from '../src/lib/api';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [loginVal, setLoginVal] = useState('demo');
  const [password, setPassword] = useState('demo1234');
  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('+998 ');

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await login({ login: loginVal, password });
        if (!res.success) {
          showToast(res.error || (locale === 'uz' ? 'Login yoki parol xato' : 'Неверный логин или пароль'), 'error');
          return;
        }
        showToast(locale === 'uz' ? 'Xush kelibsiz!' : 'Добро пожаловать!', 'success');
        router.replace('/(tabs)');
      } else {
        const res = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            companyName,
            firstName,
            lastName,
            phone,
            login: loginVal,
            password,
          }),
        });

        if (res.error) {
          showToast(res.error, 'error');
          return;
        }

        showToast(
          locale === 'uz' ? 'Roʻyxatdan muvaffaqiyatli oʻtdingiz!' : 'Регистрация прошла успешно!',
          'success'
        );
        await login({ login: loginVal, password });
        router.replace('/(tabs)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* 3.2 Top Green Banner */}
        <View style={[styles.topBanner, { paddingTop: insets.top + 20 }]}>
          <View style={styles.langToggle}>
            <TouchableOpacity
              onPress={() => setLocale(locale === 'uz' ? 'ru' : 'uz')}
              style={styles.langPill}
            >
              <Text style={styles.langPillText}>{locale === 'uz' ? 'UZ | RU' : 'RU | UZ'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.brandBox}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>UZ</Text>
            </View>
            <Text style={styles.bannerBrand}>UzSavdo</Text>
            <Text style={styles.bannerSubtitle}>
              {locale === 'uz'
                ? 'Oʻzbekiston boʻylab savdo maydonchasi'
                : 'Торговая площадка по всему Узбекистану'}
            </Text>
          </View>
        </View>

        {/* 3.2 White Card overlapping green banner */}
        <View style={styles.card}>
          {/* Segment switch */}
          <View style={styles.segment}>
            <TouchableOpacity
              onPress={() => setMode('login')}
              style={[styles.segmentBtn, mode === 'login' && styles.segmentBtnActive]}
            >
              <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                {locale === 'uz' ? 'Kirish' : 'Вход'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('register')}
              style={[styles.segmentBtn, mode === 'register' && styles.segmentBtnActive]}
            >
              <Text style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>
                {locale === 'uz' ? 'Roʻyxatdan oʻtish' : 'Регистрация'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          {mode === 'register' && (
            <>
              <Text style={styles.fieldLabel}>
                {locale === 'uz' ? 'Korxona yoki kompaniya nomi' : 'Название компании'}
              </Text>
              <TextInput
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="OOO «Agro Fayz»"
                style={styles.input}
              />

              <View style={styles.row}>
                <View style={styles.halfCol}>
                  <Text style={styles.fieldLabel}>{locale === 'uz' ? 'Ism' : 'Имя'}</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Alisher"
                    style={styles.input}
                  />
                </View>
                <View style={styles.halfCol}>
                  <Text style={styles.fieldLabel}>{locale === 'uz' ? 'Familiya' : 'Фамилия'}</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Usmonov"
                    style={styles.input}
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>{locale === 'uz' ? 'Telefon raqami' : 'Телефон'}</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+998 (90) 123-45-67"
                style={styles.input}
              />
            </>
          )}

          <Text style={styles.fieldLabel}>{locale === 'uz' ? 'Login' : 'Логин'}</Text>
          <TextInput
            value={loginVal}
            onChangeText={setLoginVal}
            autoCapitalize="none"
            placeholder={locale === 'uz' ? 'Login kiriting' : 'Введите логин'}
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>{locale === 'uz' ? 'Parol' : 'Пароль'}</Text>
          <View style={styles.passWrap}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              style={styles.passInput}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              {showPassword ? (
                <Eye size={20} color={COLORS.light.textSecondary} />
              ) : (
                <EyeOff size={20} color={COLORS.light.textSecondary} />
              )}
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAuth}
            disabled={loading}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>
              {loading
                ? (locale === 'uz' ? 'Kutilmoqda...' : 'Загрузка...')
                : mode === 'login'
                ? (locale === 'uz' ? 'Kirish' : 'Войти')
                : (locale === 'uz' ? 'Roʻyxatdan oʻtish' : 'Зарегистрироваться')}
            </Text>
          </TouchableOpacity>

          {/* Fast demo login hint */}
          <View style={styles.demoBox}>
            <Text style={styles.demoHint}>
              {locale === 'uz' ? 'Demo login: ' : 'Демо вход: '}
              <Text style={styles.demoBold}>admin</Text> yoki <Text style={styles.demoBold}>demo</Text> • Parol: <Text style={styles.demoBold}>demo1234</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scroll: {
    flexGrow: 1,
  },
  topBanner: {
    backgroundColor: COLORS.light.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 54,
    position: 'relative',
  },
  langToggle: {
    alignItems: 'flex-end',
  },
  langPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  langPillText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  brandBox: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.light.primary,
  },
  bannerBrand: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.light.surface,
    marginTop: -32,
    marginHorizontal: 16,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 40,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.light.primary,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  segmentTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    paddingHorizontal: 16,
    fontSize: 14,
    color: COLORS.light.text,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  passWrap: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  passInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.light.text,
  },
  eyeBtn: {
    padding: 6,
  },
  submitBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    shadowColor: COLORS.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
  demoBox: {
    marginTop: 18,
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
  },
  demoHint: {
    fontSize: 11,
    color: COLORS.light.primary,
  },
  demoBold: {
    fontWeight: '700',
  },
});
