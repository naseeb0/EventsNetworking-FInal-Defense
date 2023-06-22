import { Appearance } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import Footer from "./components/Footer";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import { storeData, getData } from "./config/asyncStorage";
import * as SplashScreen from "expo-splash-screen";
import RegisterScreen from "./screens/RegisterScreen";
import WorkshopScreen from "./screens/WorkshopScreen";
import AdminHome from "./screens/AdminHome";
//importing all the screens
import FooterAdmin from './components/FooterAdmin';
import HomeScreen from './screens/HomeScreen';
import RecommendationScreen from './screens/RecommendationScreen';
import DisplayScreen from './screens/DisplayScreen';
import MapScreen from './screens/MapScreen';
import { Provider } from 'react-redux';
import store from './screens/store';
//Theme context is used to update the
//theme of the app. It will be used in
//all the screens of the app.
import { ThemeContext } from "./context/ThemeContext";
import RecommendedScreen from "./screens/Recommended";
import AddEventScreen from "./screens/AddEventScreen";
//creating simple splash screen
SplashScreen.preventAutoHideAsync();

//creating stack navigator which will contain
//login, register and footer screens
//footer is the bottom tab navigator which
//includes all the other screens.
const Stack = createStackNavigator();

const App = () => {
  //Appearance.getColorScheme() will return
  //the current theme of the device and save
  //it in theme state.
  const [theme, setTheme] = useState({ mode: Appearance.getColorScheme() });

  //updateTheme function takes newTheme as a parameter
  //if newTheme is not passed then it will toggle the theme
  //and store the new theme in async storage
  const updateTheme = (newTheme) => {
    let mode;
    if (!newTheme) {
      mode = theme.mode === "dark" ? "light" : "dark";
      newTheme = { mode };
    }
    setTheme(newTheme);
    storeData("homeTheme", newTheme);
  };

  //fetchStoredTheme function will fetch the theme
  //from async storage and update the theme of the app
  //async storage is used to store the last theme that the user chose
  //so that the theme will be the same when the user opens the app next time
  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData("homeTheme");
      if (themeData) {
        updateTheme(themeData);
      }
    } catch ({ message }) {
      alert(message);
    } finally {
      //hiding the splash screen after 1 second
      await setTimeout(() => SplashScreen.hideAsync(), 1000);
    }
  };

  //fetchStoredTheme function will be called when the app starts
  useEffect(() => {
    fetchStoredTheme();

    //if the theme of the device changes then
    //updateTheme function will be called using
    //Appearance.addChangeListener method
    Appearance.addChangeListener(({ colorScheme }) => {
      updateTheme();
      setTheme({ mode: colorScheme });
    });
  }, []);

  return (
    //we will pass the theme and updateTheme function
    //to the ThemeContext.Provider so that it can be
    //used in all the screens of the app.
    <Provider store={store}>
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="Register"
            component={RegisterScreen}
          />
          <Stack.Screen
            name="Footer"
            component={Footer}
            options={{ headerShown: false }}
          />
          <Stack.Screen name = "FooterAdmin" component={FooterAdmin} options={{headerShown:false}} />
        
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown:false}} />
        <Stack.Screen name="RecommendationScreen" component={RecommendationScreen} options={{headerShown:false }} />
        <Stack.Screen name="DisplayScreen" component={DisplayScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="RecommendedScreen" component={RecommendedScreen} options={{headerShown:false }} />
        <Stack.Screen name="WorkshopScreen" component={WorkshopScreen} options={{headerShown:false }} />
        <Stack.Screen name="AdminHome" component={AdminHome} options={{headerShown:false }} />
        <Stack.Screen name="AddEventScreen" component={AddEventScreen} options={{headerShown:false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
    </Provider>
  );
};

export default App;