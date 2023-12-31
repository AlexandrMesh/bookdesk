import React from 'react';
import { arrayOf, string, shape, number, func } from 'prop-types';
import { View } from 'react-native';
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
