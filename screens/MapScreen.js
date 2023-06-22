import React from 'react';
import { Dimensions, Text, View, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

const MapScreen = ({ route }) => {
  const workshop = route.params?.workshop;
  const latitudeVal = workshop?.Latitude?.split('°')[0].trim();
  const longitudeVal = workshop?.Longitude?.split('°')[0].trim();

  const LATITUDE_DELTA = 0.1;
  const LONGITUDE_DELTA = 0.1;

  // Check if latitude and longitude values are available
  if (!latitudeVal || !longitudeVal) {
    return null; // Return null or a loading indicator until the values are available
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(latitudeVal),
          longitude: parseFloat(longitudeVal),
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(latitudeVal),
            longitude: parseFloat(longitudeVal)
          }}
        >
        <Callout>
          <Text style={styles.description}>"{workshop.Location}"</Text>
        </Callout>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  description:{
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default MapScreen;
