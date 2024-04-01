import React from 'react';
import { arrayOf, string, shape, number, func } from 'prop-types';
import { View } from 'react-native';
import notifee, { TriggerType } from '@notifee/react-native';
import { useTranslation } from 'react-i18next';
import colors from '~styles/colors';
import Button from '~UI/Button';
import { SECONDARY } from '~constants/themes';
import { FILTER_ICON } from '~constants/dimensions';
import FilterIcon from '~assets/filter.svg';
import TotalCount from './TotalCount';
import styles from './styles';

const ActionBar = ({ filterParams, totalItems, showFilters, activeFiltersCount }) => {
  const { t } = useTranslation('common');

  const categoriesLength = filterParams?.categoryPaths?.length;
  const isActiveFilter = categoriesLength > 0;

  const displayNotification = async () => {
    const date = new Date(Date.now());
    date.setMinutes(30);

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    await notifee.displayNotification({
      id: '123',
      title: 'Meeting with Jane',
      body: 'Today at 11:20am',
      android: {
        channelId,
        smallIcon: 'ic_stat_name',
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  notifee.getTriggerNotificationIds().then((ids) => console.log('All trigger notifications: ', ids));

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button
            theme={SECONDARY}
            style={[styles.button, isActiveFilter && { borderColor: colors.success }]}
            titleStyle={[styles.titleStyle, isActiveFilter > 0 && { color: colors.success }]}
            iconClassName={styles.icon}
            icon={<FilterIcon width={FILTER_ICON.width} height={FILTER_ICON.height} fill={isActiveFilter ? colors.success : colors.neutral_light} />}
            onPress={showFilters}
            title={isActiveFilter ? t('categoriesCount', { count: activeFiltersCount }) : t('categoriesTitle')}
          />
          <Button title='Display Notification' onPress={() => displayNotification()} />
        </View>
        <TotalCount count={totalItems} />
      </View>
    </View>
  );
};

ActionBar.propTypes = {
  filterParams: shape({
    categoryPaths: arrayOf(string),
  }),
  showFilters: func.isRequired,
  totalItems: number.isRequired,
  activeFiltersCount: number,
};

export default ActionBar;
