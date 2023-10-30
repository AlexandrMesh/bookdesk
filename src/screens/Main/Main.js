import React, { useCallback, useEffect } from 'react';
import { func, bool, string } from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { BOTTOM_BAR_ICON } from '~constants/dimensions';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { getT } from '~translations/i18n';
import {
  SEARCH_ROUTE,
  HOME_ROUTE,
  BOOK_DETAILS_ROUTE,
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
import BookDetails from '~screens/Home/BookDetails';
import SignIn from '~screens/Auth/SignIn';
import SignUp from '~screens/Auth/SignUp';
import Search from '~screens/Search';
import Profile from '~screens/Profile';
import Modals from '~screens/Modals/Modals';
import About from '~screens/Profile/About';
import CloseComponent from './CloseComponent';
import UnderConstruction from './UnderConstruction';

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
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        headerTintColor: colors.neutral_light,
      }}
    />
  </Stack.Navigator>
);

const MainNavigator = ({ isTheLatestAppVersion }) => (
  <Tab.Navigator
    initialRouteName={HOME_NAVIGATOR_ROUTE}
    backBehavior='history'
    screenOptions={({ route }) => ({
      tabBarStyle: { backgroundColor: colors.primary_dark, elevation: 0, borderColor: colors.neutral_medium },
      tabBarShowLabel: false,
      headerShown: false,
      tabBarIcon: ({ focused }) => {
        const icon = {
          HomeNavigator: (
            <HomeIcon width={BOTTOM_BAR_ICON.width} height={BOTTOM_BAR_ICON.height} fill={focused ? colors.neutral_light : colors.neutral_medium} />
          ),
          SearchNavigator: (
            <SearchIcon width={BOTTOM_BAR_ICON.width} height={BOTTOM_BAR_ICON.height} fill={focused ? colors.neutral_light : colors.neutral_medium} />
          ),
          ProfileNavigator: (
            <ProfileIcon
              width={BOTTOM_BAR_ICON.width}
              height={BOTTOM_BAR_ICON.height}
              fill={focused ? colors.neutral_light : colors.neutral_medium}
            />
          ),
        };

        return icon[route.name];
      },
    })}
  >
    <Tab.Screen name={HOME_NAVIGATOR_ROUTE} component={HomeNavigator} />
    <Tab.Screen name={SEARCH_NAVIGATOR_ROUTE} component={SearchNavigator} />
    <Tab.Screen
      name={PROFILE_NAVIGATOR_ROUTE}
      component={ProfileNavigator}
      options={{
        tabBarBadge: !isTheLatestAppVersion ? getT('common')('alert') : null,
        tabBarBadgeStyle: { backgroundColor: colors.success, color: colors.primary_dark },
      }}
    />
    <Tab.Screen
      name={BOOK_DETAILS_ROUTE}
      component={BookDetails}
      options={{
        headerShown: true,
        headerRight: CloseComponent,
        title: getT('books')('bookDetails'),
        tabBarButton: () => null,
        tabBarVisible: false,
        presentation: 'modal',
        headerStyle: {
          backgroundColor: colors.primary_dark,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        headerTintColor: colors.neutral_light,
      }}
    />
  </Tab.Navigator>
);

const Main = ({
  checkAuth,
  checkingStatus,
  isSignedIn,
  isTheLatestAppVersion,
  checkUnderConstruction,
  loadingUnderConstructionStatus,
  underConstruction,
}) => {
  const checkAuthentication = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await checkAuth(token);
    } catch (e) {
      console.error(e);
    }
  }, [checkAuth]);

  const checkData = useCallback(async () => {
    try {
      const result = await checkUnderConstruction();
      if (!result) {
        await checkAuthentication();
      }
    } catch (e) {
      console.error(e);
    }
  }, [checkUnderConstruction, checkAuthentication]);

  useEffect(() => {
    checkData();
  }, [checkData]);

  if (underConstruction) {
    return <UnderConstruction />;
  }

  if (checkingStatus === IDLE || checkingStatus === PENDING || loadingUnderConstructionStatus === PENDING) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isSignedIn ? (
          <MainNavigator isTheLatestAppVersion={isTheLatestAppVersion} />
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

MainNavigator.propTypes = {
  isTheLatestAppVersion: bool,
};

Main.propTypes = {
  checkAuth: func.isRequired,
  underConstruction: string,
  checkUnderConstruction: func.isRequired,
  isSignedIn: bool.isRequired,
  checkingStatus: loadingDataStatusShape,
  loadingUnderConstructionStatus: loadingDataStatusShape,
  isTheLatestAppVersion: bool,
};

export default Main;
