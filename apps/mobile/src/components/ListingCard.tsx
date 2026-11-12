import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Heart, Star } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface ListingCardProps {
  item: any;
  locale: 'uz' | 'ru';
  isFavorite?: boolean;
  onPress: () => void;
  onToggleFavorite?: () => void;
}

export function ListingCard({
  item,
  locale,
  isFavorite = false,
  onPress,
  onToggleFavorite,
}: ListingCardProps) {
  const title = locale === 'ru' && item.titleRu ? item.titleRu : item.title;
  const categoryName = locale === 'ru' && item.category?.nameRu ? item.category.nameRu : item.category?.nameUz;
  const imageUrl = item.images?.[0]?.url || item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600';

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      {/* Image container */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        
        {categoryName ? (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText} numberOfLines={1}>{categoryName}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleFavorite}
          style={styles.heartBtn}
        >
          <Heart
            size={18}
            color={isFavorite ? COLORS.light.danger : COLORS.light.textSecondary}
            fill={isFavorite ? COLORS.light.danger : 'transparent'}
          />
        </TouchableOpacity>

        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>{locale === 'uz' ? 'Yangi' : 'Новое'}</Text>
        </View>
      </View>

      {/* Info container */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <Text style={styles.price}>
          {Number(item.pricePerUnit || 1000).toLocaleString()} soʻm{' '}
          <Text style={styles.unit}>/ {item.unit || 'kg'}</Text>
        </Text>

        <Text style={styles.quantity} numberOfLines={1}>
          {locale === 'uz' ? 'Mavjud: ' : 'В наличии: '}
          <Text style={styles.quantityVal}>
            {Number(item.totalQuantity || 1000).toLocaleString()} {item.unit || 'kg'}
          </Text>
        </Text>

        <View style={styles.footer}>
          <Text style={styles.region} numberOfLines={1}>
            {item.district?.nameUz || item.region?.nameUz || 'Oʻzbekiston'}
          </Text>
          <View style={styles.rating}>
            <Star size={12} color={COLORS.light.accent} fill={COLORS.light.accent} />
            <Text style={styles.ratingVal}>4.8</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrap: {
    width: '100%',
    height: 125,
    position: 'relative',
    backgroundColor: COLORS.light.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: COLORS.light.accent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase',
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.text,
    lineHeight: 18,
    minHeight: 36,
    marginBottom: 6,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  unit: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.light.textSecondary,
  },
  quantity: {
    fontSize: 11,
    color: COLORS.light.textSecondary,
    marginTop: 2,
  },
  quantityVal: {
    fontWeight: '600',
    color: COLORS.light.text,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  region: {
    fontSize: 10,
    color: COLORS.light.textMuted,
    flex: 1,
    marginRight: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingVal: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.light.text,
  },
});
