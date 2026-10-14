import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Avatar, Button, Divider, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { ROLES_LABEL } from '../../constants/roles';

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const menuItems = [
    { icon: 'bell-outline', title: 'Notifikasi & Pemberitahuan' },
    { icon: 'shield-check-outline', title: 'Keamanan & Privasi' },
    { icon: 'help-circle-outline', title: 'Pusat Bantuan & CS' },
    { icon: 'information-outline', title: 'Tentang HuniHub v1.0' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Text
          size={76}
          label={initials}
          style={{ backgroundColor: '#0D9488' }}
          labelStyle={{ color: '#FFFFFF', fontWeight: '800', fontSize: 28 }}
        />
        <Text style={styles.name}>{user?.name || 'Pengguna'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.roleChip}>
          <MaterialCommunityIcons name="shield-account" size={14} color="#0D9488" />
          <Text style={styles.roleText}>{ROLES_LABEL[user?.role] || 'Pengguna'}</Text>
        </View>
      </View>

      {/* Account Settings Menu */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuHeader}>Pengaturan Akun</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              <Pressable style={styles.menuRow}>
                <View style={styles.menuLeft}>
                  <MaterialCommunityIcons name={item.icon} size={20} color="#0D9488" />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color="#94A3B8" />
              </Pressable>
              {index < menuItems.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Logout Button */}
      <Button
        mode="outlined"
        textColor="#EF4444"
        icon="logout"
        onPress={signOut}
        style={styles.logoutBtn}
      >
        Keluar dari Akun
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 18,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  email: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  roleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuTitle: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  divider: {
    backgroundColor: '#F1F5F9',
  },
  logoutBtn: {
    borderRadius: 14,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
});