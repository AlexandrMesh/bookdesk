import React from 'react';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import { View, Text, Pressable, SectionList, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '~UI/CheckBox';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
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

  const handleFilter = () => {
    applyFilters(boardType);
    onClose();
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

  const renderCategoryItem = ({ value, path, isExpanded, isSearchResult }) => {
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

  const renderCategory = ({ value, path, isExpanded, data }) => {
    return (
      <>
        {renderCategoryItem({ value, path, isExpanded })}
        {isExpanded && data.length > 0 && (
          <FlatList
            eyboardShouldPersistTaps='handled'
            data={data}
            renderItem={({ item }) => renderCategoryItem({ value: item.title, path: item.path })}
            keyExtractor={(item) => item.path}
          />
        )}
      </>
    );
  };

  const renderSearchResults = () => {
    if (shouldDisplaySearchResults) {
      return (
        <FlatList
          keyboardShouldPersistTaps='handled'
          data={categoriesSearchResult}
          renderItem={({ item }) => renderCategoryItem({ value: item.title, path: item.path, isSearchResult: true })}
          keyExtractor={(item) => item.path}
          ListEmptyComponent={emptySearchResult()}
        />
      );
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
      <View style={styles.wrapper}>
        {renderSearchResults()}
        {!searchQuery && (
          <SectionList
            keyboardShouldPersistTaps='handled'
            sections={categories}
            extraData={categories}
            keyExtractor={(item) => item.path}
            renderItem={({ item, section }) =>
              section.isExpanded &&
              renderCategory({ value: item.title, path: item.path, isExpanded: item.isExpanded, data: item.data, section: item.isExpanded })
            }
            renderSectionHeader={({ section }) => renderCategoryItem({ value: section.title, path: section.path, isExpanded: section.isExpanded })}
          />
        )}
      </View>
      <View style={styles.submitButtonWrapper}>
        <Button title={t('toFilter')} onPress={handleFilter} />
      </View>
    </SlideMenu>
  );
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
