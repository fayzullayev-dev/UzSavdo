import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, RefreshControl, Dimensions 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../../src/constants/theme';
import { useI18n } from '../../src/lib/i18n';
import { apiRequest } from '../../src/lib/api';
import { ListingCard } from '../../src/components/ListingCard';
import { FormSheet } from '../../src/components/FormSheet';

const { width } = Dimensions.get('window');

export default function ListingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');

  const loadListings = async () => {
    try {
      const res = await apiRequest('/listings');
      if (res.data) {
        setListings(res.data.items || res.data);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadListings();
    apiRequest('/categories').then((r) => r.data && setCategories(r.data));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadListings();
  };

  const filtered = listings.filter((item) => {
    const title = locale === 'ru' && item.titleRu ? item.titleRu : item.title;
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || item.categoryId === selectedCat;
    const price = Number(item.pricePerUnit);
    const matchPriceFrom = !priceFrom || price >= Number(priceFrom);
    const matchPriceTo = !priceTo || price <= Number(priceTo);
    return matchSearch && matchCat && matchPriceFrom && matchPriceTo;
  });

  return (
    <View style={styles.container}>
      {/* Search and Filter Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]}>
        <View style={styles.searchBox}>
          <Search size={18} color={COLORS.light.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={locale === 'uz' ? 'Mahsulot qidirish...' : 'Поиск товаров...'}
            placeholderTextColor={COLORS.light.textMuted}
            style={styles.searchInput}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={16} color={COLORS.light.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={[styles.filterBtn, selectedCat !== 'all' && styles.filterBtnActive]}
        >
          <SlidersHorizontal
            size={20}
            color={selectedCat !== 'all' ? '#FFF' : COLORS.light.text}
          />
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips */}
      <View style={styles.chipsRow}>
        <Text style={styles.countText}>
          {locale === 'uz'
            ? `${filtered.length} ta eʼlon topildi`
            : `Найдено ${filtered.length} объявлений`}
        </Text>
        {selectedCat !== 'all' && (
          <TouchableOpacity onPress={() => setSelectedCat('all')} style={styles.chip}>
            <Text style={styles.chipText}>{locale === 'uz' ? 'Kategoriya' : 'Категория'}</Text>
            <X size={12} color={COLORS.light.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 2-Column Listings Grid (Req 6.1) */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.light.primary]} />
        }
        renderItem={({ item }) => (
          <View style={styles.cardCol}>
            <ListingCard
              item={item}
              locale={locale}
              onPress={() => router.push(`/listing/${item.id}` as any)}
            />
          </View>
        )}
      />

      {/* 6.1 Filter FormSheet */}
      <FormSheet
        visible={filterVisible}
        title={locale === 'uz' ? 'Filtr' : 'Фильтр'}
        onClose={() => setFilterVisible(false)}
      >
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>
            {locale === 'uz' ? 'Kategoriya' : 'Категория'}
          </Text>
          <View style={styles.categoryWrap}>
            <TouchableOpacity
              onPress={() => setSelectedCat('all')}
              style={[styles.catOption, selectedCat === 'all' && styles.catOptionActive]}
            >
              <Text style={[styles.catOptionText, selectedCat === 'all' && styles.catOptionTextActive]}>
                {locale === 'uz' ? 'Barchasi' : 'Все'}
              </Text>
            </TouchableOpacity>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedCat(c.id)}
                style={[styles.catOption, selectedCat === c.id && styles.catOptionActive]}
              >
                <Text style={[styles.catOptionText, selectedCat === c.id && styles.catOptionTextActive]}>
                  {locale === 'uz' ? c.nameUz : c.nameRu}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>
            {locale === 'uz' ? 'Narx oraligʻi (soʻm)' : 'Диапазон цен (сум)'}
          </Text>
          <View style={styles.priceRow}>
            <TextInput
              value={priceFrom}
              onChangeText={setPriceFrom}
              keyboardType="numeric"
              placeholder={locale === 'uz' ? 'dan' : 'от'}
              style={styles.priceInput}
            />
            <TextInput
              value={priceTo}
              onChangeText={setPriceTo}
              keyboardType="numeric"
              placeholder={locale === 'uz' ? 'gacha' : 'до'}
              style={styles.priceInput}
            />
          </View>
        </View>

        <View style={styles.filterButtons}>
          <TouchableOpacity
            onPress={() => {
              setSelectedCat('all');
              setPriceFrom('');
              setPriceTo('');
              setFilterVisible(false);
            }}
            style={styles.btnGhost}
          >
            <Text style={styles.btnGhostText}>{locale === 'uz' ? 'Tozalash' : 'Сбросить'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilterVisible(false)}
            style={styles.btnPrimary}
          >
            <Text style={styles.btnPrimaryText}>{locale === 'uz' ? 'Topish' : 'Применить'}</Text>
          </TouchableOpacity>
        </View>
      </FormSheet>
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
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  searchBox: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.light.text,
    marginLeft: 8,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: COLORS.light.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.light.textSecondary,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.light.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.light.primary,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 110,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  cardCol: {
    width: (width - 32) / 2,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.light.text,
    marginBottom: 8,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.light.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  catOptionActive: {
    backgroundColor: COLORS.light.primary,
    borderColor: COLORS.light.primary,
  },
  catOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  catOptionTextActive: {
    color: '#FFF',
  },
  priceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.light.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.light.text,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  btnGhost: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.light.textSecondary,
  },
  btnPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
});
