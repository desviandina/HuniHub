import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../constants/roles';
import SeekerNavigator from './SeekerNavigator';
import OwnerNavigator from './OwnerNavigator';
import ListingDetailScreen from '../screens/seeker/ListingDetailScreen';
import RentalRequestFormScreen from '../screens/seeker/RentalRequestFormScreen';
import AddEditListingScreen from '../screens/owner/AddEditListingScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useAuth();
  const MainNavigator = user?.role === ROLES.OWNER ? OwnerNavigator : SeekerNavigator;

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerTintColor: '#0D9488',
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { fontWeight: '700', fontSize: 17, color: '#0F172A' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="Main" component={MainNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailScreen}
        options={{ title: 'Detail Hunian' }}
      />
      <Stack.Screen
        name="RentalRequestForm"
        component={RentalRequestFormScreen}
        options={{ title: 'Ajukan Sewa' }}
      />
      <Stack.Screen
        name="AddEditListing"
        component={AddEditListingScreen}
        options={{ title: 'Tambah Hunian' }}
      />
    </Stack.Navigator>
  );
}