import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  TextInput, KeyboardAvoidingView, Platform, Modal 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Building2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../src/constants/theme';
import { useI18n } from '../src/lib/i18n';
import { apiRequest } from '../src/lib/api';

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { locale, t } = useI18n();

  const [dialogs, setDialogs] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    apiRequest('/conversations').then((res) => {
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setDialogs(res.data);
      } else {
        setDialogs([
          { 
            id: 'conv-1', 
            companyName: 'Toshkent Savdo MCHJ', 
            title: 'Toshkent Savdo MCHJ',
            product: 'Gala navli sara kartoshka, Samarqand 2026',
            lastMessage: 'Assalomu alaykum! Mahsulot buyurtmangiz tayyor, qachon yetkazib beraylik?', 
            time: '10:20' 
          },
          { 
            id: 'conv-2', 
            companyName: '«Agro Fayz» MChJ', 
            title: '«Agro Fayz» MChJ',
            product: 'Paxta tolasi I-nav',
            lastMessage: 'Shartnoma tasdiqlandi, rahmat!', 
            time: 'Kecha' 
          },
        ]);
      }
    });
  }, []);

  const openChat = (item: any) => {
    setActiveConv(item);
    setMessages([
      {
        id: 'msg-1',
        text: item.lastMessage || 'Assalomu alaykum! Mahsulot buyurtmangiz tayyor, qachon yetkazib beraylik?',
        isMine: false,
        time: item.time || '10:20',
      }
    ]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        text,
        isMine: true,
        time: timeStr,
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{locale === 'uz' ? 'Xabarlar' : 'Сообщения'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={dialogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const compName = item.companyName || item.title || item.buyer?.companyName || item.seller?.companyName || 'Hamkor';
          const prodTitle = item.product || item.contract?.listing?.title || 'Mahsulot shartnomasi';
          return (
            <TouchableOpacity style={styles.dialogCard} onPress={() => openChat(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{compName[0]}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={1}>{compName}</Text>
                  <Text style={styles.time}>{item.time || '10:20'}</Text>
                </View>
                <Text style={styles.productName} numberOfLines={1}>{prodTitle}</Text>
                <Text style={styles.lastMsg} numberOfLines={1}>
                  {item.lastMessage || 'Assalomu alaykum!'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Full-screen Chat Modal on Mobile */}
      <Modal visible={!!activeConv} animationType="slide" onRequestClose={() => setActiveConv(null)}>
        <KeyboardAvoidingView 
          style={styles.chatModal} 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Modal Header */}
          <View style={[styles.chatHeader, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => setActiveConv(null)} style={styles.backBtn}>
              <ArrowLeft size={20} color={COLORS.light.text} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.chatHeaderTitle} numberOfLines={1}>
                {activeConv?.companyName || activeConv?.title || 'Hamkor'}
              </Text>
              <Text style={styles.chatHeaderSub} numberOfLines={1}>
                {activeConv?.product || activeConv?.contract?.listing?.title || 'Shartnoma muloqoti'}
              </Text>
            </View>
          </View>

          {/* Messages List */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatList}
            renderItem={({ item }) => (
              <View style={[styles.msgRow, item.isMine ? styles.msgMine : styles.msgOther]}>
                <View style={[styles.bubble, item.isMine ? styles.bubbleMine : styles.bubbleOther]}>
                  <Text style={[styles.bubbleText, item.isMine ? styles.bubbleTextMine : styles.bubbleTextOther]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.msgTime, item.isMine ? styles.msgTimeMine : styles.msgTimeOther]}>
                    {item.time}
                  </Text>
                </View>
              </View>
            )}
          />

          {/* Input Bar */}
          <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={locale === 'uz' ? 'Xabaringizni yozing...' : 'Введите сообщение...'}
              placeholderTextColor={COLORS.light.textMuted}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Send size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  dialogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.surface,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.light.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.light.primary,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.light.text,
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.light.primary,
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: COLORS.light.textMuted,
  },
  lastMsg: {
    fontSize: 12,
    color: COLORS.light.textSecondary,
  },
  chatModal: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  chatHeader: {
    backgroundColor: COLORS.light.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  chatHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.light.text,
  },
  chatHeaderSub: {
    fontSize: 11,
    color: COLORS.light.textMuted,
  },
  chatList: {
    padding: 16,
    flexGrow: 1,
  },
  msgRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  msgMine: {
    justifyContent: 'flex-end',
  },
  msgOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleMine: {
    backgroundColor: COLORS.light.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.light.surface,
    borderWidth: 1,
    borderColor: COLORS.light.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextMine: {
    color: '#FFF',
  },
  bubbleTextOther: {
    color: COLORS.light.text,
  },
  msgTime: {
    fontSize: 9,
    marginTop: 4,
    textAlign: 'right',
  },
  msgTimeMine: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  msgTimeOther: {
    color: COLORS.light.textMuted,
  },
  inputBar: {
    backgroundColor: COLORS.light.surface,
    paddingHorizontal: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.light.surfaceMuted,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 13,
    color: COLORS.light.text,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
