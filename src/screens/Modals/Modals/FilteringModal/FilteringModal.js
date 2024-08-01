import React, { useState, useEffect, useCallback } from 'react';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import { View, Text, Pressable, SectionList, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '~UI/CheckBox';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { FILTER_ICON } from '~constants/dimensions';
import ArrowDown from '~assets/arrow-down.svg';
import styles from './styles';

const FilteringModal = ({
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
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const handleFilter = () => {
    applyFilters(boardType);
    setShouldAutoClose(true);
  };

  const handleClearFilters = () => {
    clearFilters(boardType);
  };

  const { categoryPaths } = filterParams;

  const shouldDisplaySearchResults = searchQuery;

  const emptySearchResult = () => (
    <View style={styles.emptyResult}>
      <Text style={styles.emptyLabel}>{t('noCategories')}</Text>
    </View>
  );

  const renderCategoryItem = useCallback(
    ({ value, path, isExpanded, isSearchResult }) => {
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
              {shouldDisplayArrowIcon ? (
                <ArrowDown style={isExpanded ? null : styles.collapsed} width={FILTER_ICON.width} height={FILTER_ICON.height} />
              ) : null}
            </Pressable>
          )}
          <Pressable style={styles.labelWrapper} onPress={() => manageFilters(path, boardType, categoryPaths)}>
            <Text style={styles.menuItemTitle}>{t(`categories:${value}`)}</Text>
            <CheckBox isChecked={categoryPaths.includes(path)} indeterminate={indeterminate} />
          </Pressable>
        </View>
      );
    },
    [boardType, categoryPaths, indeterminatedCategories, manageFilters, t, toggleExpandedCategory],
  );

  const getKeyExtractorForCategory = useCallback((item) => item.path, []);

  const renderItemForCategory = useCallback(({ item }) => renderCategoryItem({ value: item.title, path: item.path }), [renderCategoryItem]);

  const renderCategory = useCallback(
    ({ value, path, isExpanded, data }) => {
      return (
        <>
          {renderCategoryItem({ value, path, isExpanded })}
          {isExpanded && data.length > 0 && (
            <FlatList keyboardShouldPersistTaps='handled' data={data} renderItem={renderItemForCategory} keyExtractor={getKeyExtractorForCategory} />
          )}
        </>
      );
    },
    [getKeyExtractorForCategory, renderCategoryItem, renderItemForCategory],
  );

  const getKeyExtractorForSearch = useCallback((item) => item.path, []);

  const renderItemForSearch = useCallback(
    ({ item }) => renderCategoryItem({ value: item.title, path: item.path, isSearchResult: true }),
    [renderCategoryItem],
  );

  const renderSearchResults = () => {
    if (shouldDisplaySearchResults) {
      return (
        <FlatList
          keyboardShouldPersistTaps='handled'
          data={categoriesSearchResult}
          renderItem={renderItemForSearch}
          keyExtractor={getKeyExtractorForSearch}
          ListEmptyComponent={emptySearchResult()}
        />
      );
    }
    return null;
  };

  const getKeyExtractor = useCallback((item) => item.path, []);

  const renderItem = useCallback(
    ({ item, section }) =>
      section.isExpanded &&
      renderCategory({ value: item.title, path: item.path, isExpanded: item.isExpanded, data: item.data, section: item.isExpanded }),
    [renderCategory],
  );

  const renderSectionHeader = useCallback(
    ({ section }) => renderCategoryItem({ value: section.title, path: section.path, isExpanded: section.isExpanded }),
    [renderCategoryItem],
  );

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  return isVisible ? (
    <SlideMenu
      isVisible={isVisible}
      shouldAutoClose={shouldAutoClose}
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
      <View style={styles.wrapper}>
        {renderSearchResults()}
        {!searchQuery && (
          <SectionList
            keyboardShouldPersistTaps='handled'
            sections={categories}
            extraData={categories}
            keyExtractor={getKeyExtractor}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
          />
        )}
      </View>
      <View style={styles.submitButtonWrapper}>
        <Button style={styles.submitButton} title={t('toFilter')} onPress={handleFilter} />
      </View>
    </SlideMenu>
  ) : null;
};

FilteringModal.propTypes = {
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
  categories: arrayOf(shape({ path: string, title: string, isExpanded: bool })),
  categoriesSearchResult: arrayOf(shape({ path: string, title: string })),
  searchQuery: string,
};

export default FilteringModal;
