import React, { FC, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { useNetInfo } from '@react-native-community/netinfo';
import { lt } from 'semver';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { BOTTOM_BAR_ICON, BOTTOM_BAR_ADD_ICON } from '~constants/dimensions';
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
  PROFILE_NAVIGATOR_ROUTE,
  SIGN_IN_ROUTE,
  SIGN_UP_ROUTE,
  STAT_NAVIGATOR_ROUTE,
  STAT_ROUTE,
  ADD_CUSTOM_BOOK_ROUTE,
  ADD_CUSTOM_BOOK_NAVIGATOR_ROUTE,
} from '~constants/routes';
import HomeIcon from '~assets/home.svg';
import StatIcon from '~assets/stat.svg';
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
import AddGoal from '~screens/Goals/AddGoal';
import GoalDetails from '~screens/Goals/GoalDetails';
import About from '~screens/Profile/About';
import DateUpdater from '~screens/Home/DateUpdater';
import { useAppDispatch, useAppSelector } from '~hooks';
import { checkAuth, getConfig } from '~redux/actions/authActions';
import { getCheckingStatus, getIsSignedIn } from '~redux/selectors/auth';
import { getGoalNumberOfPages } from '~redux/selectors/goals';
import { getNewCustomBookNameValue } from '~redux/selectors/customBook';
import { MAIN_CONFIG_URL, RESERVE_CONFIG_URL } from '../../config/api';
import CloseComponent from './CloseComponent';
import EditComponent from './EditComponent';
import UnderConstruction from './UnderConstruction';
import UpdateApp from './UpdateApp';
import NoConnection from './NoConnection';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StatNavigator = () => {
  const { t } = useTranslation('statistic');

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
      <Stack.Screen name={STAT_ROUTE} component={Statistic} options={{ title: t('statistic') }} />
    </Stack.Navigator>
  );
};

type GoalsNavigatorProps = {
  hasGoal: boolean;
};

const GoalsNavigator: FC<GoalsNavigatorProps> = ({ hasGoal }) => {
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
          title: t('readingTracker'),
        }}
      />
      <Stack.Screen name={ADD_GOAL} component={AddGoal} options={{ title: t('addGoal') }} />
      <Stack.Screen
        name={GOAL_DETAILS}
        component={GoalDetails}
        options={{
          title: t('goalForToday', { date: new Date().toLocaleString(i18n.language, { day: 'numeric', month: 'long' }) }),
          headerLeft: undefined,
          headerRight: EditComponent,
        }}
      />
    </Stack.Navigator>
  );
};

const HomeNavigator = () => {
  const { t } = useTranslation('search');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary_dark,
          shadowColor: 'transparent',
          borderBottomWidth: 1,
          borderColor: colors.neutral_medium,
        },
        presentation: 'modal',
        headerTintColor: colors.neutral_light,
      }}
    >
      <Stack.Screen name={HOME_ROUTE} component={Home} options={{ headerShown: false }} />
      <Stack.Screen name={SEARCH_ROUTE} component={Search} options={{ title: t('search') }} />
    </Stack.Navigator>
  );
};

type AddCustomBookNavigatorProps = {
  customBookName: string;
};

const AddCustomBookNavigator: FC<AddCustomBookNavigatorProps> = ({ customBookName }) => {
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

type ProfileNavigatorProps = {
  isTheLatestAppVersion: boolean;
  googlePlayUrl: string;
};

const ProfileNavigator: FC<ProfileNavigatorProps> = ({ isTheLatestAppVersion, googlePlayUrl }) => {
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
      <Stack.Screen name={PROFILE_ROUTE} options={{ title: t('profile') }}>
        {() => <Profile isTheLatestAppVersion={isTheLatestAppVersion} googlePlayUrl={googlePlayUrl} />}
      </Stack.Screen>
      <Stack.Screen name={ABOUT_ROUTE} component={About} options={{ title: t('about') }} />
    </Stack.Navigator>
  );
};

type MainNavigatorProps = {
  isTheLatestAppVersion: boolean;
  googlePlayUrl: string;
  hasGoal: boolean;
  customBookName: string;
};

const getIcon = (focused: boolean, route: any) => {
  const icon = {
    HomeNavigator: (
      <HomeIcon width={BOTTOM_BAR_ICON.width} height={BOTTOM_BAR_ICON.height} fill={focused ? colors.neutral_light : colors.neutral_medium} />
    ),
    StatNavigator: (
      <StatIcon width={BOTTOM_BAR_ICON.width} height={BOTTOM_BAR_ICON.height} fill={focused ? colors.neutral_light : colors.neutral_medium} />
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
      <ProfileIcon width={BOTTOM_BAR_ICON.width} height={BOTTOM_BAR_ICON.height} fill={focused ? colors.neutral_light : colors.neutral_medium} />
    ),
  };

  return (icon as any)[route.name];
};

const MainNavigator: FC<MainNavigatorProps> = ({ isTheLatestAppVersion, googlePlayUrl, hasGoal, customBookName }) => {
  const { t } = useTranslation(['common', 'books']);

  return (
    <Tab.Navigator
      initialRouteName={HOME_NAVIGATOR_ROUTE}
      backBehavior='history'
      screenOptions={({ route }) => ({
        tabBarStyle: { backgroundColor: colors.primary_dark, elevation: 0, borderColor: colors.neutral_medium },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({ focused }) => getIcon(focused, route),
      })}
    >
      <Tab.Screen name={HOME_NAVIGATOR_ROUTE} component={HomeNavigator} />
      <Tab.Screen name={STAT_NAVIGATOR_ROUTE} component={StatNavigator} />
      <Tab.Screen name={ADD_CUSTOM_BOOK_NAVIGATOR_ROUTE}>{() => <AddCustomBookNavigator customBookName={customBookName} />}</Tab.Screen>
      <Tab.Screen name={GOALS_NAVIGATOR_ROUTE}>{() => <GoalsNavigator hasGoal={hasGoal} />}</Tab.Screen>
      <Tab.Screen
        name={PROFILE_NAVIGATOR_ROUTE}
        options={{
          tabBarBadge: !isTheLatestAppVersion ? t('common:alert') : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.success, color: colors.primary_dark },
        }}
      >
        {() => <ProfileNavigator isTheLatestAppVersion={isTheLatestAppVersion} googlePlayUrl={googlePlayUrl} />}
      </Tab.Screen>
      <Tab.Screen
        name={BOOK_DETAILS_ROUTE}
        component={BookDetails}
        options={{
          headerShown: true,
          headerRight: CloseComponent,
          title: t('books:bookDetails'),
          tabBarButton: () => null,
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

const Main = () => {
  const [shouldDisplayUpdateView, setShouldDisplayUpdateView] = useState(false);
  const [shouldDisplayUnderConstructionView, setShouldDisplayUnderConstructionView] = useState(false);
  const [isTheLatestAppVersion, setIsTheLatestAppVersion] = useState(true);
  const [googlePlayUrl, setGooglePlayUrl] = useState('');
  const { isConnected } = useNetInfo();

  const dispatch = useAppDispatch();
  const _checkAuth = useCallback((token: string) => dispatch(checkAuth(token)), [dispatch]);
  const _getConfig = useCallback((url: string) => dispatch(getConfig(url)), [dispatch]);

  const checkingStatus = useAppSelector(getCheckingStatus);
  const hasGoal = !!useAppSelector(getGoalNumberOfPages);
  const isSignedIn = useAppSelector(getIsSignedIn);
  const customBookName = useAppSelector(getNewCustomBookNameValue);

  const checkAuthentication = useCallback(async () => {
    try {
      const token = (await AsyncStorage.getItem('token')) as string;
      await _checkAuth(token);
    } catch (e) {
      console.error(e);
    }
  }, [_checkAuth]);

  const getConfiguration = useCallback(
    async (url: string) => {
      try {
        const { minimumSupportedAppVersion, underConstruction, appVersion, googlePlayUrl } = await _getConfig(url).unwrap();
        setIsTheLatestAppVersion(appVersion === DeviceInfo.getVersion());
        setGooglePlayUrl(googlePlayUrl);
        if (minimumSupportedAppVersion && lt(DeviceInfo.getVersion(), minimumSupportedAppVersion)) {
          setShouldDisplayUpdateView(true);
        } else if (underConstruction) {
          setShouldDisplayUnderConstructionView(true);
        } else {
          await checkAuthentication();
        }
      } catch (error) {
        // If we have troubles with connection to MAIN_CONFIG_URL we will try to connect to RESERVE_CONFIG_URL
        console.error(error);
        getConfiguration(RESERVE_CONFIG_URL);
      }
    },
    [_getConfig, checkAuthentication],
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

  if (isConnected === false) {
    return <NoConnection />;
  }

  if (checkingStatus === IDLE || checkingStatus === PENDING) {
    return <Splash />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isSignedIn ? (
          <MainNavigator
            isTheLatestAppVersion={isTheLatestAppVersion}
            googlePlayUrl={googlePlayUrl}
            hasGoal={hasGoal}
            customBookName={customBookName}
          />
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

export default Main;
