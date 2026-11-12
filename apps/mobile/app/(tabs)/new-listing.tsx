import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TextInput, 
  TouchableOpacity, Image 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Image as ImageIcon, Plus, Check, ArrowRight, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useI18n } from '../../src/lib/i18n';
import { useToast } from '../../src/components/TopToast';
import { apiRequest } from '../../src/lib/api';

export default function NewListingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [unit, setUnit] = useState('kg');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiRequest('/categories').then((r) => {
      if (r.data && r.data.length > 0) {
        setCategories(r.data);
        setCategoryId(r.data[0].id);
      }
    });
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      setImages([...images, ...uris].slice(0, 5));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim()) {
        showToast(locale === 'uz' ? 'Mahsulot nomini kiriting' : 'Введите название товара', 'error');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!pricePerUnit || !totalQuantity) {
        showToast(locale === 'uz' ? 'Narx va miqdorni kiriting' : 'Введите цену и количество', 'error');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiRequest('/listings', {
        method: 'POST',
        body: JSON.stringify({
          categoryId,
          title,
          pricePerUnit: Number(pricePerUnit),
          unit,
          totalQuantity: Number(totalQuantity),
          description,
          images: images.length > 0 ? images.map((u) => ({ url: u })) : undefined,
        }),
      });

      if (res.error) {
        showToast(res.error, 'error');
        return;
      }

      showToast(
        locale === 'uz' ? 'Eʼlon muvaffaqiyatli joylashtirildi!' : 'Объявление успешно опубликовано!',
        'success'
      );
      router.replace('/(tabs)/listings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>
          {locale === 'uz' ? 'Yangi eʼlon joylash' : 'Новое объявление'}
        </Text>
        {/* Step indicator */}
        <View style={styles.stepsRow}>
          {[1, 2, 3, 4].map((s) => (
            <View
              key={s}
              style={[
                styles.stepDot,
                step === s && styles.stepDotActive,
                step > s && styles.stepDotDone,
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  step === s && styles.stepTextActive,
                  step > s && styles.stepTextDone,
                ]}
              >
                {s}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.stepBox}>
            <Text style={styles.boxTitle}>
              {locale === 'uz' ? '1. Mahsulot va Kategoriya' : '1. Товар и Категория'}
            </Text>

            <Text style={styles.inputLabel}>
              {locale === 'uz' ? 'Kategoriya' : 'Категория'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => setCategoryId(c.id)}
                  style={[styles.catPill, categoryId === c.id && styles.catPillActive]}
                >
                  <Text style={[styles.catPillText, categoryId === c.id && styles.catPillTextActive]}>
                    {locale === 'uz' ? c.nameUz : c.nameRu}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>
              {locale === 'uz' ? 'Eʼlon sarlavhasi / Mahsulot nomi' : 'Название товара'}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={locale === 'uz' ? 'Masalan: Gala kartoshka, 1-nav' : 'Например: Картофель Гала'}
              style={styles.textInput}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepBox}>
            <Text style={styles.boxTitle}>
              {locale === 'uz' ? '2. Narx va Miqdor' : '2. Цена и Количество'}
            </Text>

            <Text style={styles.inputLabel}>
              {locale === 'uz' ? 'Birlik narxi (soʻm)' : 'Цена за единицу (сум)'}
            </Text>
            <TextInput
              value={pricePerUnit}
              onChangeText={setPricePerUnit}
              keyboardType="numeric"
              placeholder="12 000"
              style={styles.textInput}
            />

            <Text style={styles.inputLabel}>
              {locale === 'uz' ? 'Oʻlchov birligi' : 'Единица измерения'}
            </Text>
            <View style={styles.unitRow}>
              {['kg', 'tonna', 'dona', 'litr', 'metr', 'qop'].map((u) => (
                <TouchableOpacity
                  key={u}
                  onPress={() => setUnit(u)}
                  style={[styles.unitPill, unit === u && styles.unitPillActive]}
                >
                  <Text style={[styles.unitPillText, unit === u && styles.unitPillTextActive]}>
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>
              {locale === 'uz' ? 'Mavjud umumiy hajm' : 'Общее количество в наличии'}
            </Text>
            <TextInput
              value={totalQuantity}
              onChangeText={setTotalQuantity}
              keyboardType="numeric"
              placeholder="5 000"
              style={styles.textInput}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepBox}>
            <Text style={styles.boxTitle}>
              {locale === 'uz' ? '3. Fotosuratlar (5 tagacha)' : '3. Фотографии (до 5 шт)'}
            </Text>

            <TouchableOpacity onPress={pickImage} style={styles.uploadArea}>
              <Camera size={32} color={COLORS.light.primary} />
              <Text style={styles.uploadText}>
                {locale === 'uz' ? 'Rasm yuklash (Galereyadan tanlash)' : 'Загрузить фото из галереи'}
              </Text>
              <Text style={styles.uploadHint}>
                {locale === 'uz' ? 'Avtomatik ravishda ≤ 2 MB gacha siqiladi' : 'Автоматически сжимается до ≤ 2 МБ'}
              </Text>
            </TouchableOpacity>

            <View style={styles.imagesRow}>
              {images.map((uri, idx) => (
                <View key={idx} style={styles.thumbWrap}>
                  <Image source={{ uri }} style={styles.thumb} />
                  {idx === 0 && (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeText}>Asosiy</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepBox}>
            <Text style={styles.boxTitle}>
              {locale === 'uz' ? '4. Qoʻshimcha maʼlumotlar' : '4. Дополнительно'}
            </Text>

            <Text style={styles.inputLabel}>
              {locale === 'uz' ? 'Batafsil tavsif' : 'Подробное описание'}
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholder={locale === 'uz' ? 'Mahsulot holati, qadoqlanishi va yetkazib berish shartlari...' : 'Условия доставки, упаковка...'}
              style={[styles.textInput, styles.textArea]}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Button Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 80 }]}>
        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backBtn}>
            <ArrowLeft size={18} color={COLORS.light.text} />
            <Text style={styles.backBtnText}>{locale === 'uz' ? 'Orqaga' : 'Назад'}</Text>
          </TouchableOpacity>
        )}

        {step < 4 ? (
          <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>{locale === 'uz' ? 'Keyingisi' : 'Далее'}</Text>
            <ArrowRight size={18} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitBtn}
          >
            <Text style={styles.submitBtnText}>
              {isSubmitting
                ? (locale === 'uz' ? 'Yuklanmoqda...' : 'Публикация...')
                : (locale === 'uz' ? 'Eʼlonni joylashtirish' : 'Опубликовать объявление')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.light.text,
    marginBottom: 10,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: COLORS.light.primary,
  },
  stepDotDone: {
    backgroundColor: COLORS.light.primarySoft,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.light.textMuted,
  },
  stepTextActive: {
    color: '#FFF',
  },
  stepTextDone: {
    color: COLORS.light.primary,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  stepBox: {
    backgroundColor: COLORS.light.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.light.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.light.text,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.light.surfaceMuted,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  catPillActive: {
    backgroundColor: COLORS.light.primary,
    borderColor: COLORS.light.primary,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  catPillTextActive: {
    color: '#FFF',
  },
  unitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  unitPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: COLORS.light.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  unitPillActive: {
    backgroundColor: COLORS.light.primary,
    borderColor: COLORS.light.primary,
  },
  unitPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  unitPillTextActive: {
    color: '#FFF',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: COLORS.light.primarySoft,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFCFB',
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.primary,
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 11,
    color: COLORS.light.textMuted,
    marginTop: 2,
  },
  imagesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    right: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    alignItems: 'center',
  },
  mainBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFF',
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
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  backBtn: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  nextBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.light.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  submitBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.light.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFF',
  },
});
