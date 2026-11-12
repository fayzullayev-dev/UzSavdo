import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Pressable } from 'react-native';
import { AlertTriangle, HelpCircle } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

interface ConfirmSheetProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  visible,
  title,
  description,
  confirmText = 'Tasdiqlash',
  cancelText = 'Bekor qilish',
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          
          <View style={[styles.iconBox, isDanger && styles.iconBoxDanger]}>
            {isDanger ? (
              <AlertTriangle size={28} color={COLORS.light.danger} />
            ) : (
              <HelpCircle size={28} color={COLORS.light.primary} />
            )}
          </View>

          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}

          <View style={styles.buttons}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onConfirm}
              style={[styles.btn, isDanger ? styles.btnDanger : styles.btnPrimary]}
            >
              <Text style={styles.btnText}>{confirmText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onCancel}
              style={[styles.btn, styles.btnGhost]}
            >
              <Text style={styles.btnGhostText}>{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.light.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: 'center',
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: COLORS.light.border,
    borderRadius: 2,
    marginBottom: 18,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconBoxDanger: {
    backgroundColor: '#FDECEC',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttons: {
    width: '100%',
    gap: 10,
  },
  btn: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.light.primary,
  },
  btnDanger: {
    backgroundColor: COLORS.light.danger,
  },
  btnGhost: {
    backgroundColor: COLORS.light.surfaceMuted,
  },
  btnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  btnGhostText: {
    color: COLORS.light.text,
    fontSize: 15,
    fontWeight: '600',
  },
});
