import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const WorkshopScreen = ({ navigation }) => {
  const [workshop, setWorkshop] = useState('');

  const handleSelectWorkshop = () => {
    navigation.navigate('Recommendation', { workshop });
  };

  return (
    <View>
      <Text>Select Workshop:</Text>
      <Button title="Workshop 1" onPress={() => setWorkshop('Workshop 1')} />
      <Button title="Workshop 2" onPress={() => setWorkshop('Workshop 2')} />
      <Button title="Workshop 3" onPress={() => setWorkshop('Workshop 3')} />
      <Button title="Submit" onPress={handleSelectWorkshop} />
    </View>
  );
};

export default WorkshopScreen;
