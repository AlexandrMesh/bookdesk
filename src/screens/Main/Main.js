import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { func, bool, string } from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import { lt } from 'semver';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { BOTTOM_BAR_ICON, BOTTOM_BAR_ADD_ICON } from '~constants/dimensions';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import i18n from '~translations/i18n';
import {
  SEARCH_ROUTE,
  GOALS_ROUTE,
  GOAL_DETAILS,
  ADD_GOAL,
  HOME_ROUTE,
  BOOK_DETAILS_ROUTE,
  PROFILE_ROUTE,
  ABOUT_ROUTE,
  HOME_NAVIGATOR_ROUTE,
  GOALS_NAVIGATOR_ROUTE,
  SEARCH_NAVIGATOR_ROUTE,
  PROFILE_NAVIGATOR_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  ADD_CUSTOM_BOOK_ROUTE,
  ADD_CUSTOM_BOOK_NAVIGATOR_ROUTE,
} from '~constants/routes';
import HomeIcon from '~assets/home.svg';
import SearchIcon from '~assets/search.svg';
import GoalIcon from '~assets/goal.svg';
import ProfileIcon from '~assets/profile.svg';
import AddCustomBookIcon from '~assets/add.svg';
import colors from '~styles/colors';
import Splash from '~screens/Splash';
import Home from '~screens/Home';
import AddCustomBook from '~screens/AddCustomBook';
import BookDetails from '~screens/Home/BookDetails';
import SignIn from '~screens/Auth/SignIn';
import SignUp from '~screens/Auth/SignUp';
import Search from '~screens/Search';
import Statistic from '~screens/Statistic';
import Profile from '~screens/Profile';
import Modals from '~screens/Modals/Modals';
import Goals from '~screens/Goals/Goals';
import AddGoal from '~screens/Goals/AddGoal/AddGoal';
import GoalDetails from '~screens/Goals/GoalDetails';
import About from '~screens/Profile/About';
import DateUpdater from '~screens/Home/DateUpdater';
import { MAIN_CONFIG_URL, RESERVE_CONFIG_URL } from '../../config/api';
import CloseComponent from './CloseComponent';
import EditComponent from './EditComponent';
import UnderConstruction from './UnderConstruction';
import UpdateApp from './UpdateApp';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const SearchNavigator = () => {
  const { t } = useTranslation('search');

  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: false,
        headerStyle: {
          backgroundColor: colors.primary_dark,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        headerTintColor: colors.neutral_light,
      }}
    >
      <Stack.Screen name={SEARCH_ROUTE} component={Statistic} options={{ title: t('search') }} />
    </Stack.Navigator>
  );
};

const GoalsNavigator = ({ hasGoal }) => {
  const { t } = useTranslation('goals');

  return (
    <Stack.Navigator
      initialRouteName={hasGoal ? GOAL_DETAILS : GOALS_ROUTE}
      screenOptions={{
        animationEnabled: false,
        headerStyle: {
          backgroundColor: colors.primary_dark,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        headerTintColor: colors.neutral_light,
      }}
    >
      <Stack.Screen
        name={GOALS_ROUTE}
        component={Goals}
        options={{
          title: t('goals'),
        }}
      />
      <Stack.Screen name={ADD_GOAL} component={AddGoal} options={{ title: t('addGoal') }} />
      <Stack.Screen
        name={GOAL_DETAILS}
        component={GoalDetails}
        options={{
          title: t('goalForToday', { date: new Date().toLocaleString(i18n.language, { day: 'numeric', month: 'long' }) }),
          headerLeft: null,
          headerRight: EditComponent,
        }}
      />
    </Stack.Navigator>
  );
};

GoalsNavigator.propTypes = {
  hasGoal: bool,
};

const HomeNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name={HOME_ROUTE} component={Home} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const AddCustomBookNavigator = ({ customBookName }) => {
  const { t } = useTranslation('customBook');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary_dark,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        headerTintColor: colors.neutral_light,
      }}
    >
      <Stack.Screen
        name={ADD_CUSTOM_BOOK_ROUTE}
        component={AddCustomBook}
        options={{ title: customBookName ? `${t('addBook')} - ${customBookName}` : t('addBook') }}
      />
    </Stack.Navigator>
  );
};

AddCustomBookNavigator.propTypes = {
  customBookName: string,
};

const ProfileNavigator = () => {
  const { t } = useTranslation('profile');

  return (
    <Stack.Navigator
      screenOptions={{
        animationEnabled: false,
        headerStyle: {
          backgroundColor: colors.primary_dark,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        headerTintColor: colors.neutral_light,
      }}
    >
      <Stack.Screen name={PROFILE_ROUTE} component={Profile} options={{ title: t('profile') }} />
      <Stack.Screen name={ABOUT_ROUTE} component={About} options={{ title: t('about') }} />
    </Stack.Navigator>
  );
};

const MainNavigator = ({ isTheLatestAppVersion, hasGoal, customBookName }) => {
  const { t } = useTranslation(['common', 'books']);

  return (
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
              <SearchIcon
                width={BOTTOM_BAR_ICON.width}
                height={BOTTOM_BAR_ICON.height}
                fill={focused ? colors.neutral_light : colors.neutral_medium}
              />
            ),
            AddCustomBookNavigator: (
              <AddCustomBookIcon
                width={BOTTOM_BAR_ADD_ICON.width}
                height={BOTTOM_BAR_ADD_ICON.height}
                strokeWidth={1.5}
                stroke={focused ? colors.neutral_light : colors.neutral_medium}
              />
            ),
            GoalsNavigator: (
              <GoalIcon width={BOTTOM_BAR_ICON.width} height={BOTTOM_BAR_ICON.height} fill={focused ? colors.neutral_light : colors.neutral_medium} />
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
      <Tab.Screen name={ADD_CUSTOM_BOOK_NAVIGATOR_ROUTE}>{() => <AddCustomBookNavigator customBookName={customBookName} />}</Tab.Screen>
      <Tab.Screen name={GOALS_NAVIGATOR_ROUTE}>{() => <GoalsNavigator hasGoal={hasGoal} />}</Tab.Screen>
      <Tab.Screen
        name={PROFILE_NAVIGATOR_ROUTE}
        component={ProfileNavigator}
        options={{
          tabBarBadge: !isTheLatestAppVersion ? t('common:alert') : null,
          tabBarBadgeStyle: { backgroundColor: colors.success, color: colors.primary_dark },
        }}
      />
      <Tab.Screen
        name={BOOK_DETAILS_ROUTE}
        component={BookDetails}
        options={{
          headerShown: true,
          headerRight: CloseComponent,
          title: t('books:bookDetails'),
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
};

MainNavigator.propTypes = {
  isTheLatestAppVersion: bool,
  hasGoal: bool,
  customBookName: string,
};

const Main = ({ checkAuth, checkingStatus, isSignedIn, isTheLatestAppVersion, hasGoal, customBookName, getConfig }) => {
  const [shouldDisplayUpdateView, setShouldDisplayUpdateView] = useState(false);
  const [shouldDisplayUnderConstructionView, setShouldDisplayUnderConstructionView] = useState(false);

  const checkAuthentication = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await checkAuth(token);
    } catch (e) {
      console.error(e);
    }
  }, [checkAuth]);

  const getConfiguration = useCallback(
    async (url) => {
      try {
        const { minimumSupportedAppVersion, underConstruction } = await getConfig(url);
        if (minimumSupportedAppVersion && lt(DeviceInfo.getVersion(), minimumSupportedAppVersion)) {
          setShouldDisplayUpdateView(true);
        } else if (underConstruction) {
          setShouldDisplayUnderConstructionView(true);
        } else {
          await checkAuthentication();
        }
      } catch (error) {
        // If we have troubles with connection to MAIN_CONFIG_URL we will try to connect to RESERVE_CONFIG_URL
        getConfiguration(RESERVE_CONFIG_URL);
      }
    },
    [getConfig, checkAuthentication],
  );

  useEffect(() => {
    getConfiguration(MAIN_CONFIG_URL);
  }, [getConfiguration]);

  if (shouldDisplayUnderConstructionView) {
    return <UnderConstruction />;
  }

  if (shouldDisplayUpdateView) {
    return <UpdateApp />;
  }

  if (checkingStatus === IDLE || checkingStatus === PENDING) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isSignedIn ? (
          <MainNavigator isTheLatestAppVersion={isTheLatestAppVersion} hasGoal={hasGoal} customBookName={customBookName} />
        ) : (
          <Stack.Navigator screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name={SIGN_IN_ROUTE} component={SignIn} options={{ headerShown: false }} />
            <Stack.Screen name={SIGN_UP_ROUTE} component={SignUp} options={{ headerShown: false }} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
      <Modals />
      <DateUpdater />
    </SafeAreaProvider>
  );
};

Main.propTypes = {
  checkAuth: func.isRequired,
  getConfig: func.isRequired,
  isSignedIn: bool.isRequired,
  hasGoal: bool.isRequired,
  checkingStatus: loadingDataStatusShape,
  isTheLatestAppVersion: bool,
  customBookName: string,
};

export default Main;
