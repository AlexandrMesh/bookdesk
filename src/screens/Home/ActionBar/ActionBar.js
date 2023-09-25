import React, { useRef, useState } from 'react';
import { arrayOf, string, shape, number, func } from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from '~styles/colors';
import Button from '~UI/Button';
import { SECONDARY } from '~constants/themes';
import FilterIcon from '~assets/filter.svg';
import ActionSheet from 'react-native-actions-sheet';
import TotalCount from './TotalCount';
import Filtering from '../Filtering';
import styles from './styles';

const ActionBar = ({ filterParams, editableFilterParams, boardType, totalItems, resetFilterParams }) => {
  const { t } = useTranslation('common');
  const actionSheetRef = useRef(null);

  const [filteringVisibility, setFilteringVisibility] = useState(false);

  const displayFilters = () => actionSheetRef.current?.show();
  const hideFilters = () => {
    resetFilterParams(boardType);
    setFilteringVisibility(false);
  };

  const categoriesLength = filterParams?.categoryPaths?.length;
  const isActiveFilter = categoriesLength > 0;

  return (
    <>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.buttons}>
            <Button
              theme={SECONDARY}
              style={[styles.button, isActiveFilter && { borderColor: colors.success }]}
              titleStyle={[styles.titleStyle, isActiveFilter > 0 && { color: colors.success }]}
              iconClassName={styles.icon}
              icon={<FilterIcon width='16' height='16' fill={isActiveFilter ? colors.success : colors.neutral_light} />}
              onPress={displayFilters}
              title={isActiveFilter ? t('categoriesCount', { count: categoriesLength }) : t('categoriesTitle')}
            />
          </View>
          <TotalCount count={totalItems} />
        </View>
      </View>
      <ActionSheet ref={actionSheetRef}>
        <Filtering isVisible={filteringVisibility} boardType={boardType} onClose={hideFilters} filterParams={editableFilterParams} />
      </ActionSheet>
    </>
  );
};

ActionBar.propTypes = {
  filterParams: shape({
    categoryPaths: arrayOf(string),
  }),
  editableFilterParams: shape({
    categoryPaths: arrayOf(string),
  }),
  boardType: string.isRequired,
  totalItems: number.isRequired,
  resetFilterParams: func.isRequired,
};

export default ActionBar;
