import React from 'react';
import { func } from 'prop-types';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from '~styles/colors';
import { useTranslation } from 'react-i18next';
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

const HeaderTabs = ({ t }) => (
  <Tab.Navigator
    initialRouteName={ALL_BOOKS_ROUTE}
    screenOptions={{
      tabBarItemStyle: { width: 'auto' },
      tabBarStyle: {
        backgroundColor: colors.primary_dark,
        borderBottomWidth: 1,
        borderColor: colors.neutral_medium,
      },
      tabBarIndicatorStyle: { backgroundColor: colors.neutral_light },
    }}
  >
    <Tab.Screen name={ALL_BOOKS_ROUTE} component={AllBooks} options={{ tabBarLabel: ({ focused }) => renderLabel(t('recommended'), focused) }} />
    <Tab.Screen name={PLANNED_BOOKS_ROUTE} component={PlannedBooks} options={{ tabBarLabel: ({ focused }) => renderLabel(t('planned'), focused) }} />
    <Tab.Screen
      name={IN_PROGRESS_BOOKS_ROUTE}
      component={InProgressBooks}
      options={{ tabBarLabel: ({ focused }) => renderLabel(t('inProgress'), focused) }}
    />
    <Tab.Screen
      name={COMPLETED_BOOKS_ROUTE}
      component={CompletedBooks}
      options={{ tabBarLabel: ({ focused }) => renderLabel(t('completed'), focused) }}
    />
  </Tab.Navigator>
);

HeaderTabs.propTypes = {
  t: func.isRequired,
};

const Home = () => {
  const { t } = useTranslation('books');
  return (
    <View style={styles.container}>
      <HeaderTabs t={t} />
    </View>
  );
};

export default Home;
