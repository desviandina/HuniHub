import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import { colors } from '../constants/theme';

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.background }}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}