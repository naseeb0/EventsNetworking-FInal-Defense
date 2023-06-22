// import React, { useState, useEffect } from 'react';
// import { ScrollView } from 'react-native';
// import { TextInput, Button } from 'react-native-paper';
// import { createEvent, getLastIdValue } from './api';

// const AddEventScreen = () => {
//   const [workshopName, setWorkshopName] = useState('');
//   const [genre, setGenre] = useState('');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState('');
//   const [college, setCollege] = useState('');
//   const [location, setLocation] = useState('');
//   const [eventId, setEventId] = useState(null);

//   useEffect(() => {
//     const getLastId = async () => {
//       try {
//         const lastId = await getLastIdValue();
//         setEventId(lastId + 1);
//       } catch (error) {
//         console.error('Error retrieving last ID:', error);
//       }
//     };

//     getLastId();
//   }, []);

//   const handleAddEvent = async () => {
//     try {
//       const eventData = {
//         ID: eventId,
//         Workshop: workshopName,
//         Genre: genre,
//         Description: description,
//         Images: image,
//         College: college,
//         Location: location,
//       };

//       await createEvent(eventData);

//       console.log('Event created successfully:', eventData);
//       // Show success message or navigate to another screen
//     } catch (error) {
//       console.error('Error creating event:', error);
//       // Show error message
//     }
//   };

//   return (
//     <ScrollView>
//       <TextInput
//         label="Workshop Name"
//         value={workshopName}
//         onChangeText={setWorkshopName}
//       />
//       <TextInput label="Genre" value={genre} onChangeText={setGenre} />
//       <TextInput
//         label="Description"
//         value={description}
//         onChangeText={setDescription}
//       />
//       <TextInput label="Image" value={image} onChangeText={setImage} />
//       <TextInput label="College" value={college} onChangeText={setCollege} />
//       <TextInput
//         label="Location"
//         value={location}
//         onChangeText={setLocation}
//       />
//       <Button mode="contained" onPress={handleAddEvent}>
//         Add Event
//       </Button>

//       {eventId && <Text>Generated ID: {eventId}</Text>}
//     </ScrollView>
//   );
// };

// export default AddEventScreen;



import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createEvent } from './api';

const AddEventScreen = () => {
  const [workshopName, setWorkshopName] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [college, setCollege] = useState('');
  const [location, setLocation] = useState('');
  const [eventId, setEventId] = useState(null);

  const handleAddEvent = async () => {
    try {
      const eventData = {
        Workshop: workshopName,
        Genre: genre,
        Description: description,
        Images: image,
        College: college,
        Location: location,
      };

      const createdEvent = await createEvent(eventData);
      setEventId(createdEvent.ID);

      console.log('Event created successfully:', createdEvent);
      // Show success message or navigate to another screen
    } catch (error) {
      console.error('Error creating event:', error);
      // Show error message
    }
  };

  return (
    <ScrollView>
      <TextInput
        label="Workshop Name"
        value={workshopName}
        onChangeText={setWorkshopName}
      />
      <TextInput label="Genre" value={genre} onChangeText={setGenre} />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput label="Image" value={image} onChangeText={setImage} />
      <TextInput label="College" value={college} onChangeText={setCollege} />
      <TextInput
        label="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button mode="contained" onPress={handleAddEvent}>
        Add Event
      </Button>

      {eventId && <Text>Generated ID: {eventId}</Text>}
    </ScrollView>
  );
};

export default AddEventScreen;
