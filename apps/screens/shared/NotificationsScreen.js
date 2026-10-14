import React, { useCallback, useState } from 'react';
import { FlatList, View, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import { listNotifications, markAsRead } from '../../services/notificationService';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';

export default function NotificationsScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setNotifications(await listNotifications(user));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleOpen = async (item) => {
    if (!item.read) {
      await markAsRead(item.id);
      await load();
    }
  };

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item }) => {
      const isUnread = !item.read;

      return (
        <Pressable
          onPress={() => handleOpen(item)}
          style={[styles.card, isUnread && styles.unreadCard]}
        >
          <View style={styles.cardRow}>
            <View
              style={[
                styles.iconBadge,
                isUnread ? styles.iconBadgeUnread : styles.iconBadgeRead,
              ]}
            >
              <MaterialCommunityIcons
                name={isUnread ? 'bell-badge-outline' : 'bell-outline'}
                size={20}
                color={isUnread ? '#0D9488' : '#94A3B8'}
              />
            </View>

            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {isUnread && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.itemBody}>{item.body}</Text>
              <Text style={styles.itemDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </Pressable>
      );
    },
    []
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        ListEmptyComponent={
          loading ? (
            <Text style={{ textAlign: 'center', paddingVertical: 32, color: '#64748B' }}>
              Memuat notifikasi...
            </Text>
          ) : (
            <EmptyState
              icon="bell-outline"
              title="Belum ada notifikasi"
              subtitle="Pemberitahuan status sewa hunian Anda akan otomatis tampil di sini."
            />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
  },
  unreadCard: {
    backgroundColor: '#F0FDFA',
    borderColor: '#CCFBF1',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeUnread: {
    backgroundColor: '#CCFBF1',
  },
  iconBadgeRead: {
    backgroundColor: '#F1F5F9',
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D9488',
  },
  itemBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 6,
  },
  itemDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
});