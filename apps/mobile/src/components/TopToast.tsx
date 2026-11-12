import React, { createContext, useContext, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const translateY = useRef(new Animated.Value(-120)).current;
  const insets = useSafeAreaInsets();
  const timerRef = useRef<any>(null);

  const showToast = (message: string, toastType: ToastType = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setText(message);
    setType(toastType);
    setVisible(true);

    Animated.timing(translateY, {
      toValue: insets.top + 10,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Disappear after 2 seconds per requirement 2.5
    timerRef.current = setTimeout(() => {
      hide();
    }, 2000);
  };

  const hide = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return COLORS.light.success;
      case 'error': return COLORS.light.danger;
      case 'warning': return COLORS.light.warning;
      default: return COLORS.light.primary;
    }
  };

  const renderIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} color={COLORS.light.success} />;
      case 'error': return <AlertOctagon size={20} color={COLORS.light.danger} />;
      case 'warning': return <AlertTriangle size={20} color={COLORS.light.warning} />;
      default: return <Info size={20} color={COLORS.light.primary} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              borderLeftColor: getBorderColor(),
            },
          ]}
        >
          <View style={styles.iconWrap}>{renderIcon()}</View>
          <Text style={styles.text} numberOfLines={2}>
            {text}
          </Text>
          <TouchableOpacity onPress={hide} style={styles.closeBtn}>
            <X size={16} color={COLORS.light.textMuted} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
    backgroundColor: COLORS.light.surface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  iconWrap: {
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.light.text,
  },
  closeBtn: {
    padding: 4,
    marginLeft: 6,
  },
});
