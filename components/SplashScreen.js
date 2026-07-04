import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  Dimensions,
  Easing,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  // Animation values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.4)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const pulseScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Run introductory animation sequence
    Animated.sequence([
      // 1. Spring the logo in with a rotation and scale-up
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      // 2. Fade in and slide up text (brand name & tagline)
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1)),
          useNativeDriver: true,
        }),
      ]),
      // 3. Fade in loader
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start continuous logo pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseScale, {
            toValue: 1.06,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseScale, {
            toValue: 1.0,
            duration: 1200,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  // Interpolate rotation
  const spin = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={['#082928', '#0E4442', '#155C59', '#1A827F']}
        locations={[0, 0.4, 0.85, 1]}
        style={styles.gradientContainer}
      >
        {/* Decorative background glow elements for premium look */}
        <View style={styles.glowTopLeft} />
        <View style={styles.glowBottomRight} />

        <View style={styles.contentContainer}>
          {/* Logo container with double-ring glowing background */}
          <View style={styles.logoOuterWrapper}>
            <Animated.View
              style={[
                styles.logoGlowRing,
                {
                  opacity: logoOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.15],
                  }),
                  transform: [{ scale: Animated.multiply(logoScale, pulseScale) }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.logoCard,
                {
                  opacity: logoOpacity,
                  transform: [
                    { scale: Animated.multiply(logoScale, pulseScale) },
                    { rotate: spin },
                  ],
                },
              ]}
            >
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
              />
            </Animated.View>
          </View>

          {/* Text Section */}
          <Animated.View
            style={[
              styles.textContainer,
              {
                opacity: textOpacity,
                transform: [{ translateY: textTranslateY }],
              },
            ]}
          >
            <Text style={styles.brandText}>Medora</Text>
            <View style={styles.divider} />
            <Text style={styles.taglineText}>FOR DOCTORS</Text>
          </Animated.View>

          {/* Elegant minimalist loader dot indicator */}
          <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
            <View style={styles.loadingPulse} />
          </Animated.View>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>SECURE HEALTH NETWORK</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowTopLeft: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
    backgroundColor: '#1E9E9A',
    opacity: 0.12,
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -height * 0.15,
    right: -width * 0.25,
    width: width * 1.1,
    height: width * 1.1,
    borderRadius: (width * 1.1) / 2,
    backgroundColor: '#1A827F',
    opacity: 0.15,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -40,
  },
  logoOuterWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    marginBottom: 24,
  },
  logoGlowRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    shadowColor: '#1E9E9A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  logoCard: {
    width: 110,
    height: 110,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
  },
  brandText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  divider: {
    width: 40,
    height: 2.5,
    backgroundColor: '#1E9E9A',
    marginVertical: 10,
    borderRadius: 2,
  },
  taglineText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D4EBEA',
    letterSpacing: 4.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loaderContainer: {
    marginTop: 40,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.65,
  },
  footerContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A0D2D0',
    letterSpacing: 2,
    opacity: 0.7,
  },
});
