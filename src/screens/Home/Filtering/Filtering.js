import React from 'react';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '~UI/CheckBox';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import { SECONDARY } from '~constants/themes';
import ArrowDown from '~assets/arrow-down.svg';
import styles from './styles';

const Filtering = ({
  isVisible,
  filterParams,
  onClose,
  boardType,
  applyFilters,
  categories,
  toggleExpandedCategory,
  indeterminatedCategories,
  manageFilters,
  clearFilters,
}) => {
  const { t } = useTranslation(['common', 'categories']);

  const handleFilter = () => {
    applyFilters(boardType);
    onClose();
  };

  const handleClearFilters = () => {
    clearFilters(boardType);
  };

  const { categoryPaths } = filterParams;

  const renderCategory = (value, path, isExpanded) => {
    const splittedPath = path.split('.');
    const level = splittedPath.length;
    const iconWrapperStyle = () => {
      if (level === 1) {
        return styles.firstLevel;
      }
      return null;
    };

    const shouldDisplayArrowIcon = level === 1 || level === 2;
    const indeterminate = indeterminatedCategories.includes(path);

    return (
      <View key={path} style={styles.menuItem}>
        <Pressable onPress={() => toggleExpandedCategory(path, boardType)} style={[styles.arrowIconWrapper, iconWrapperStyle()]}>
          {shouldDisplayArrowIcon ? <ArrowDown style={isExpanded ? null : styles.collapsed} width='16' height='16' /> : null}
        </Pressable>
        <Pressable key={value} style={styles.labelWrapper} onPress={() => manageFilters(path, boardType, categoryPaths)}>
          <Text style={styles.menuItemTitle}>{t(`categories:${value}`)}</Text>
          <CheckBox isChecked={categoryPaths.includes(path)} indeterminate={indeterminate} />
        </Pressable>
      </View>
    );
  };

  return (
    <SlideMenu isVisible={isVisible} title={t('categoriesTitle')} onClose={onClose} onReset={() => undefined} menuHeight={500}>
      <ScrollView style={styles.wrapper}>
        {categories.map(({ value, path, isExpanded, children }) => (
          <View key={path}>
            {renderCategory(value, path, isExpanded)}
            {isExpanded
              ? children.map(({ value, path, isExpanded, children }) => (
                  <View key={path}>
                    {renderCategory(value, path, isExpanded)}
                    {isExpanded ? children.map(({ value, path }) => renderCategory(value, path)) : null}
                  </View>
                ))
              : null}
          </View>
        ))}
      </ScrollView>
      <View style={styles.submitButtonWrapper}>
        <Button style={categoryPaths.length > 0 && styles.button} title={t('toFilter')} onPress={handleFilter} />
        {categoryPaths.length > 0 ? <Button style={styles.button} theme={SECONDARY} title={t('clear')} onPress={handleClearFilters} /> : null}
      </View>
    </SlideMenu>
  );
};

Filtering.propTypes = {
  isVisible: bool.isRequired,
  filterParams: shape({
    categoryPaths: arrayOf(string),
  }).isRequired,
  manageFilters: func.isRequired,
  onClose: func.isRequired,
  boardType: string.isRequired,
  applyFilters: func.isRequired,
  clearFilters: func.isRequired,
  toggleExpandedCategory: func.isRequired,
  indeterminatedCategories: arrayOf(string).isRequired,
  categories: arrayOf(shape({ path: string, value: string })),
};

export default Filtering;
