import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from '~styles/colors';
import { getT } from '~translations/i18n';
import { ALL_BOOKS_ROUTE, PLANNED_BOOKS_ROUTE, IN_PROGRESS_BOOKS_ROUTE, COMPLETED_BOOKS_ROUTE } from '~constants/routes';
import AllBooks from './AllBooks';
import PlannedBooks from './PlannedBooks';
import InProgressBooks from './InProgressBooks';
import CompletedBooks from './CompletedBooks';
import styles from './styles';

const Tab = createMaterialTopTabNavigator();

const renderLabel = (label, focused) => (
  <View>
    <Text style={[styles.tabBarLabel, { color: focused ? colors.neutral_light : colors.neutral_medium }]}>{label}</Text>
  </View>
);

const HeaderTabs = () => (
  <Tab.Navigator
    initialRouteName={ALL_BOOKS_ROUTE}
    screenOptions={{
      tabBarStyle: { backgroundColor: colors.primary_dark, borderBottomWidth: 1, borderColor: colors.neutral_medium },
      tabBarIndicatorStyle: { backgroundColor: colors.neutral_light },
    }}
  >
    <Tab.Screen
      name={ALL_BOOKS_ROUTE}
      component={AllBooks}
      options={{ tabBarLabel: ({ focused }) => renderLabel(getT('books')('catalogTitle'), focused) }}
    />
    <Tab.Screen
      name={PLANNED_BOOKS_ROUTE}
      component={PlannedBooks}
      options={{ tabBarLabel: ({ focused }) => renderLabel(getT('books')('planned'), focused) }}
    />
    <Tab.Screen
      name={IN_PROGRESS_BOOKS_ROUTE}
      component={InProgressBooks}
      options={{ tabBarLabel: ({ focused }) => renderLabel(getT('books')('inProgress'), focused) }}
    />
    <Tab.Screen
      name={COMPLETED_BOOKS_ROUTE}
      component={CompletedBooks}
      options={{ tabBarLabel: ({ focused }) => renderLabel(getT('books')('completed'), focused) }}
    />
  </Tab.Navigator>
);

const Home = () => (
  <View style={styles.container}>
    <HeaderTabs />
  </View>
);

export default Home;
