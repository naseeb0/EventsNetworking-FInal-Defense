import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ScrollView, Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getRecommendations } from './RecommendationService';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../context/ThemeContext';
import { colors } from '../config/theme';

const RecommendationScreen = ({ route, navigation }) => {
  const { workshop } = route.params;
  const [recommendations, setRecommendations] = useState([]);
  const starMappings = {
    1: 'star',
    2: 'star',
    3: 'star',
    4: 'star',
    5: 'star',
  };

  const { theme } = useContext(ThemeContext);
  const activeColors = colors[theme.mode];

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (route?.params?.selectedWorkshops) {
        try {
          const selectedWorkshops = route.params.selectedWorkshops;
          const allRecommendations = [];

          for (const workshop of selectedWorkshops) {
            const fetchedRecommendations = await getRecommendations(workshop);
            const topRecommendations = fetchedRecommendations.slice(0, 5);
            allRecommendations.push(...topRecommendations);
          }

          setRecommendations(allRecommendations);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }
    };

    fetchRecommendations();
  }, [route?.params?.selectedWorkshops]);

  const handleCardPress = (workshop) => {
    navigation.navigate('DisplayScreen', { workshop });
  };

  return (
    <View style={[styles.container, { backgroundColor: activeColors.primary }]}>
      <ScrollView>
        <View style={styles.contentContainer}>
          {recommendations.map((recommendation, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.cardContainer,
                { backgroundColor: activeColors.card },
              ]}
              onPress={() => handleCardPress(recommendation)}
            >
              <Text style={[styles.workshopText, { color: activeColors.text }]}>
                {recommendation.Workshop}
              </Text>
              <Text style={[styles.collegeText, { color: activeColors.text }]}>
                {recommendation.College}
              </Text>
              <Image source={{ uri: recommendation.Images }} style={styles.image} resizeMode="contain" />
              <View style={styles.ratingContainer}>
                {Array(recommendation.Ratings)
                  .fill()
                  .map((_, index) => (
                    <Icon key={index} name={starMappings[recommendation.Ratings]} style={styles.starIcon} />
                  ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    marginTop: 45,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardContainer: {
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    padding: 16,
  },
  workshopText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  collegeText: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  starIcon: {
    color: 'gold',
    fontSize: 25,
    marginRight: 2,
  },
});

export default RecommendationScreen;
