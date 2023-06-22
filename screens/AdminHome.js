import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, FAB, TextInput, Button } from 'react-native-paper';
import { ThemeContext } from '../context/ThemeContext';
import { addToFavorites } from './actions';
import { fetchEvents, getEventById,deleteEvent, updateEvent, createEvent, } from './api';
import { useDispatch } from 'react-redux';
import { StyleSheet } from 'react-native';
import AddEventScreen from './AddEventScreen';
import {handleAddEvent} from './AddEventScreen';
const AdminHome = () => {
  const [randomWorkshops, setRandomWorkshops] = useState([]);
  const [selectedWorkshops, setSelectedWorkshops] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const [showAddEventScreen, setShowAddEventScreen] = useState(false);


  useEffect(() => {
    getRandomWorkshops();
  }, []);

  const handleSelectWorkshop = (workshop) => {
    setSelectedEvent(workshop);
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
  

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      console.log('Event deleted successfully');
      console.log(id+" deleted");
      // Perform any additional actions after successful deletion, such as updating the UI or showing a success message
    } catch (error) {
      console.error('Error deleting event:', error);
      // Handle the error, such as showing an error message
    }
  };

  const handleUpdateEvent = async (id) => {
    try {
      // Fetch the event data from the API based on the ID
      const event = await getEventById(id);
      if (event) {
        // Perform any modifications or updates to the event data as needed
        const updatedEventData = { ...event, ...updatedEventData };
        await updateEvent(id, updatedEventData);
        console.log('Event updated successfully');
        // Perform any additional actions after successful update, such as updating the UI or showing a success message
      } else {
        console.log('Event not found');
        // Handle the case when the event is not found
      }
    } catch (error) {
      console.error('Error updating event:', error);
      // Handle the error, such as showing an error message
    }
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
                        name="star"
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
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => handleUpdateEvent(workshop.ID)}
              >
                <Icon name="pencil" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 8 }}
                onPress={() => {
                  Alert.alert(
                    'Confirmation',
                    'Are you sure you want to delete this event?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => handleDeleteEvent(workshop.ID),
                      },
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Icon name="delete" size={20} color={theme.mode === 'dark' ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      ))}
      {showAddEventScreen && (
      <AddEventScreen
        onClose={() => setShowAddEventScreen(false)}
        onCreateEvent={handleAddEvent}
      />
    )}
      <FAB
      style={styles.fab}
      icon="plus"
      onPress={() => setShowAddEventScreen(true)}
    />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default AdminHome;
