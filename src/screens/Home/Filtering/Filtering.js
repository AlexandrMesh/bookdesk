import React from 'react';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '~UI/CheckBox';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
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
  searchQuery,
  categoriesSearchResult,
  searchCategory,
  clearSearchQueryForCategory,
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

  const shouldDisplaySearchResults = searchQuery && categoriesSearchResult.length > 0;

  const emptySearchResult = () => (
    <View style={styles.emptyResult}>
      <Text style={styles.emptyLabel}>Не найдено категорий</Text>
    </View>
  );

  const renderCategory = ({ value, path, isExpanded, isSearchResult }) => {
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
      <View key={path} style={[styles.menuItem, isSearchResult && styles.searchResult]}>
        {!isSearchResult && (
          <Pressable
            disabled={!shouldDisplayArrowIcon}
            onPress={() => toggleExpandedCategory(path, boardType)}
            style={[styles.arrowIconWrapper, iconWrapperStyle()]}
          >
            {shouldDisplayArrowIcon ? <ArrowDown style={isExpanded ? null : styles.collapsed} width='16' height='16' /> : null}
          </Pressable>
        )}
        <Pressable style={styles.labelWrapper} onPress={() => manageFilters(path, boardType, categoryPaths)}>
          <Text style={styles.menuItemTitle}>{t(`categories:${value}`)}</Text>
          <CheckBox isChecked={categoryPaths.includes(path)} indeterminate={indeterminate} />
        </Pressable>
      </View>
    );
  };

  const renderSearchResults = () => {
    if (shouldDisplaySearchResults) {
      return categoriesSearchResult.map(({ value, path }) => renderCategory({ value, path, isSearchResult: true }));
    }
    if (searchQuery && categoriesSearchResult.length === 0) {
      return emptySearchResult();
    }
    return null;
  };

  return (
    <SlideMenu
      isVisible={isVisible}
      title={t('categoriesTitle')}
      onClose={onClose}
      menuHeight={500}
      titleReset={categoryPaths.length > 0 ? t('clear') : ''}
      onReset={handleClearFilters}
    >
      <Input
        placeholder={t('searchCategory')}
        onChangeText={searchCategory}
        value={searchQuery}
        validateable={false}
        shouldDisplayClearButton={!!searchQuery}
        onClear={clearSearchQueryForCategory}
      />
      <ScrollView style={styles.wrapper} keyboardShouldPersistTaps='handled'>
        {renderSearchResults()}
        {!searchQuery &&
          categories.map(({ value, path, isExpanded, children }) => (
            <View key={path}>
              {renderCategory({ value, path, isExpanded })}
              {isExpanded
                ? children.map(({ value, path, isExpanded, children }) => (
                    <View key={path}>
                      {renderCategory({ value, path, isExpanded })}
                      {isExpanded ? children.map(({ value, path }) => renderCategory({ value, path })) : null}
                    </View>
                  ))
                : null}
            </View>
          ))}
      </ScrollView>
      <View style={styles.submitButtonWrapper} keyboardShouldPersistTaps='handled'>
        <Button title={t('toFilter')} onPress={handleFilter} />
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
  searchCategory: func.isRequired,
  toggleExpandedCategory: func.isRequired,
  clearSearchQueryForCategory: func.isRequired,
  indeterminatedCategories: arrayOf(string).isRequired,
  categories: arrayOf(shape({ path: string, value: string, isExpanded: bool })),
  categoriesSearchResult: arrayOf(shape({ path: string, value: string })),
  searchQuery: string,
};

export default Filtering;
