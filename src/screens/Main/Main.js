import React, { useCallback, useEffect } from 'react';
import { func, bool, string } from 'prop-types';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PENDING } from '~constants/loadingStatuses';
import { getT } from '~translations/i18n';
import {
  SEARCH_ROUTE,
  HOME_ROUTE,
  PROFILE_ROUTE,
  ABOUT_ROUTE,
  HOME_NAVIGATOR_ROUTE,
  SEARCH_NAVIGATOR_ROUTE,
  PROFILE_NAVIGATOR_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
} from '~constants/routes';
import HomeIcon from '~assets/home.svg';
import SearchIcon from '~assets/search.svg';
import ProfileIcon from '~assets/profile.svg';
import colors from '~styles/colors';
import Splash from '~screens/Splash';
import Home from '~screens/Home';
import SignIn from '~screens/Auth/SignIn';
import SignUp from '~screens/Auth/SignUp';
import Search from '~screens/Search';
import Profile from '~screens/Profile';
import Modals from '~screens/Modals/Modals';
import About from '~screens/Profile/About';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SearchNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={SEARCH_ROUTE} component={Search} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={HOME_ROUTE} component={Home} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const ProfileNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={PROFILE_ROUTE} component={Profile} options={{ headerShown: false }} />
    <Stack.Screen
      name={ABOUT_ROUTE}
      component={About}
      options={{
        title: getT('profile')('about'),
        animationEnabled: false,
        headerStyle: {
          backgroundColor: colors.primary_dark,
        },
        headerTintColor: colors.neutral_light,
      }}
      screenOptions={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
    initialRouteName={HOME_NAVIGATOR_ROUTE}
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: colors.primary_dark, elevation: 0 },
      tabBarShowLabel: false,
      headerShown: false,
      tabBarIcon: ({ focused }) => {
        const icon = {
          HomeNavigator: <HomeIcon width='22' height='22' fill={focused ? colors.neutral_light : colors.neutral_medium} />,
          SearchNavigator: <SearchIcon width='22' height='22' fill={focused ? colors.neutral_light : colors.neutral_medium} />,
          ProfileNavigator: <ProfileIcon width='22' height='22' fill={focused ? colors.neutral_light : colors.neutral_medium} />,
        };

        return icon[route.name];
      },
    })}
  >
    <Tab.Screen name={HOME_NAVIGATOR_ROUTE} component={HomeNavigator} />
    <Tab.Screen name={SEARCH_NAVIGATOR_ROUTE} component={SearchNavigator} />
    <Tab.Screen name={PROFILE_NAVIGATOR_ROUTE} component={ProfileNavigator} />
  </Tab.Navigator>
);

const Main = ({ checkAuth, checkingStatus, isSignedIn }) => {
  const checkAuthentication = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await checkAuth(token);
    } catch (e) {
      console.error(e);
    }
  }, [checkAuth]);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  if (checkingStatus === PENDING) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isSignedIn ? (
          <MainNavigator />
        ) : (
          <Stack.Navigator screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name={SIGN_IN_ROUTE} component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name={SIGN_UP_ROUTE} component={SignUp} options={{ headerShown: false }} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
      <Modals />
    </SafeAreaProvider>
  );
};

Main.propTypes = {
  checkAuth: func.isRequired,
  isSignedIn: bool.isRequired,
  checkingStatus: string,
};

export default Main;
