import React from 'react';
import { StyleSheet, View, ActivityIndicator, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, AuthContext } from './context/AuthContext';
import PhoneScreen from './screens/PhoneScreen';
import OtpScreen from './screens/OtpScreen';
import DashboardScreen from './screens/DashboardScreen';
import ScannerScreen from './screens/ScannerScreen';
import PatientSummaryScreen from './screens/PatientSummaryScreen';
import SplashScreen from './components/SplashScreen';

const Stack = createNativeStackNavigator();

function NavigationWrapper() {
  const { isAuthenticated, isLoading } = React.useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A827F" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Phone" component={PhoneScreen} />
          <Stack.Screen name="Otp" component={OtpScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Scanner" component={ScannerScreen} />
          <Stack.Screen name="PatientSummary" component={PatientSummaryScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function MainAppContent() {
  const { isLoading } = React.useContext(AuthContext);
  const [splashVisible, setSplashVisible] = React.useState(true);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    // Show splash screen for at least 2.5 seconds (2500ms) for high-end look
    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    // When authentication check is done AND minimum display duration has elapsed,
    // fade out splash screen.
    if (!isLoading && minimumTimeElapsed) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setSplashVisible(false);
      });
    }
  }, [isLoading, minimumTimeElapsed]);

  return (
    <View style={styles.container}>
      <StatusBar style={splashVisible ? "light" : "dark"} />
      
      <NavigationContainer>
        <NavigationWrapper />
      </NavigationContainer>

      {splashVisible && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
          <SplashScreen />
        </Animated.View>
      )}
    </View>
  );
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FC',
  },
});
