import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from 'react-native-paper'; // Import Card component from Material UI
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext
import { addToFavorites } from './actions';
import { fetchEvents } from './api';
import { useDispatch } from 'react-redux';

const HomeScreen = () => {
  const [randomWorkshops, setRandomWorkshops] = useState([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState([]);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext); // Access the current theme from the context
  const dispatch = useDispatch();

  useEffect(() => {
    getRandomWorkshops();
  }, []);

  const handleSelectWorkshop = (workshop) => {
    navigation.navigate('RecommendationScreen', { workshop });
  };

  const getRandomWorkshops = async () => {
    try {
      const events = await fetchEvents();
      if (events.length > 0) {
        const randomIndices = getRandomIndices(events.length, 20);
        const workshops = randomIndices.map((index) => events[index]).filter(Boolean);
        if (workshops.length > 0) {
          setRandomWorkshops(workshops);
        } else {
          console.log('Random workshops not found.');
        }
      } else {
        console.log('No workshops available.');
      }
    } catch (error) {
      console.error('Error getting random workshops:', error);
    }
  };

  const isWorkshopSelected = (workshop) => {
    return selectedWorkshops.includes(workshop);
  };
  
  const getRandomIndices = (max, count) => {
    const indices = [];
    while (indices.length < count) {
      const randomIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randomIndex)) {
        indices.push(randomIndex);
      }
    }
    return indices;
  };

  const handleFavoriteWorkshop = (workshop) => {
    const isSelected = selectedWorkshops.includes(workshop);
    const updatedSelectedWorkshops = isSelected
      ? selectedWorkshops.filter((selected) => selected !== workshop)
      : [...selectedWorkshops, workshop];
    setSelectedWorkshops(updatedSelectedWorkshops);

    if (!isSelected) {
      dispatch(addToFavorites(workshop)); // Dispatch the addToFavorites action
      navigation.navigate('RecommendationScreen', { selectedWorkshops: updatedSelectedWorkshops });
    }
  };
  
  const starMappings = {
    1: 'star',
    2: 'star',
    3: 'star',
    4: 'star',
    5: 'star',
  };

  const cardStyle = {
    margin: 16,
    backgroundColor: theme.mode === 'dark' ? '#333333' : '#FFFFFF', // Set the background color based on the current theme
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <ScrollView>
      {randomWorkshops.map((workshop, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleSelectWorkshop(workshop.Workshop)}
        >
          <Card style={cardStyle}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: workshop.Images }}
                style={{ width: 100, height: 100, borderRadius: 8 }}
                resizeMode="contain"
              />
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: theme.mode === 'dark' ? '#FFFFFF' : '#333333' }}>
                  {workshop.Workshop}
                </Text>
                <Text style={{ fontSize: 14, marginBottom: 8, color: theme.mode === 'dark' ? '#FFFFFF' : '#333333' }}>{workshop.College}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Array(workshop.Ratings)
                    .fill()
                    .map((_, index) => (
                      <Icon
                        key={index}
                        name={starMappings[workshop.Ratings]}
                        style={{ color: 'gold', fontSize: 20 }}
                      />
                    ))}
                </View>
              </View>
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => handleFavoriteWorkshop(workshop.Workshop)}
              >
               <Icon
  name={isWorkshopSelected(workshop.Workshop) ? 'heart' : 'heart-outline'}
  size={20}
  color={isWorkshopSelected(workshop.Workshop) ? 'red' : theme.mode === 'dark' ? '#FFFFFF' : '#333333'}
/>

              </TouchableOpacity>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default HomeScreen;
