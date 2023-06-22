import React, { useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';

const WorkshopCard = ({ workshop, activeColors, index, onPress }) => {
  const translateYAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateYAnim, {
        toValue: 0,
        speed: 10,
        bounciness: 5,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100, // Delay each card animation
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateYAnim, scaleAnim, index]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Animated.View
        style={[
          styles.cardContainer,
          {
            backgroundColor: activeColors.card,
            transform: [
              { translateY: translateYAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <Text style={[styles.workshopText, { color: activeColors.text }]}>
          {workshop}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const RecommendedScreen = () => {
  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  const favorites = useSelector((state) => state.favorites.favorites);

  const handleWorkshopPress = (workshop) => {
    // Handle workshop press event
    console.log('Pressed:', workshop);
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.primary }]}>

      {/* Render the list of favorite workshops */}
      <View style={styles.workshopsContainer}>
        {favorites.map((workshop, index) => (
          <WorkshopCard
            key={index}
            workshop={workshop}
            activeColors={activeColors}
            index={index}
            onPress={() => handleWorkshopPress(workshop)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  workshopsContainer: {
    marginTop: 20,
  },
  cardContainer: {
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  workshopText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RecommendedScreen;
