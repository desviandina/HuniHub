import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/owner/DashboardScreen';
import ManageListingsScreen from '../screens/owner/ManageListingsScreen';
import RentalRequestsScreen from '../screens/owner/RentalRequestsScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator();

const tabs = [
  { name: 'Dashboard', component: DashboardScreen, icon: 'view-dashboard-outline', activeIcon: 'view-dashboard' },
  { name: 'Kelola', component: ManageListingsScreen, icon: 'office-building-outline', activeIcon: 'office-building' },
  { name: 'Permintaan', component: RentalRequestsScreen, icon: 'clipboard-text-outline', activeIcon: 'clipboard-text' },
  { name: 'Notifikasi', component: NotificationsScreen, icon: 'bell-outline', activeIcon: 'bell' },
  { name: 'Profil', component: ProfileScreen, icon: 'account-outline', activeIcon: 'account' },
];

export default function OwnerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        },
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 17,
          color: '#0F172A',
        },
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.neutral.gray,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          elevation: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const config = tabs.find((item) => item.name === route.name);
          return (
            <MaterialCommunityIcons
              name={focused ? config.activeIcon : config.icon}
              color={color}
              size={24}
            />
          );
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}