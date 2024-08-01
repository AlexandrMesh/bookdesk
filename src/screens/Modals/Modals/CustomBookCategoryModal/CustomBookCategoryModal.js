import React, { useState, useEffect, useCallback } from 'react';
import { bool, func, string, shape, arrayOf } from 'prop-types';
import { View, Text, Pressable, SectionList, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import RadioButton from '~UI/RadioButton';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { FILTER_ICON } from '~constants/dimensions';
import ArrowDown from '~assets/arrow-down.svg';
import styles from './styles';

const CustomBookCategoryModal = ({
  isVisible,
  onClose,
  categories,
  toggleExpandedCategory,
  searchQuery,
  categoriesSearchResult,
  setSearchQuery,
  selectCategory,
  clearSearchQueryForCategory,
  selectedCategoryPath,
  submitCategory,
}) => {
  const { t } = useTranslation(['common', 'categories']);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const handleSave = () => {
    setShouldAutoClose(true);
    submitCategory();
  };

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

      return (
        <View key={path} style={[styles.menuItem, isSearchResult && styles.searchResult]}>
          {!isSearchResult && (
            <Pressable
              disabled={!shouldDisplayArrowIcon}
              onPress={() => toggleExpandedCategory(path)}
              style={[styles.arrowIconWrapper, iconWrapperStyle()]}
            >
              {shouldDisplayArrowIcon ? (
                <ArrowDown style={isExpanded ? null : styles.collapsed} width={FILTER_ICON.width} height={FILTER_ICON.height} />
              ) : null}
            </Pressable>
          )}
          <Pressable
            style={styles.labelWrapper}
            onPress={() => (level === 3 ? selectCategory({ label: value, path }) : toggleExpandedCategory(path))}
          >
            <Text style={styles.menuItemTitle}>{t(`categories:${value}`)}</Text>
            {level === 3 && <RadioButton isSelected={selectedCategoryPath === path} />}
          </Pressable>
        </View>
      );
    },
    [selectCategory, selectedCategoryPath, t, toggleExpandedCategory],
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
    <SlideMenu isVisible={isVisible} shouldAutoClose={shouldAutoClose} title={t('categoriesTitle')} onClose={onClose} menuHeight={500}>
      <Input
        placeholder={t('searchCategory')}
        onChangeText={setSearchQuery}
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
        <Button style={styles.submitButton} title={t('save')} onPress={handleSave} />
      </View>
    </SlideMenu>
  ) : null;
};

CustomBookCategoryModal.propTypes = {
  isVisible: bool.isRequired,
  onClose: func.isRequired,
  setSearchQuery: func.isRequired,
  selectCategory: func.isRequired,
  submitCategory: func.isRequired,
  toggleExpandedCategory: func.isRequired,
  clearSearchQueryForCategory: func.isRequired,
  categories: arrayOf(shape({ path: string, title: string, isExpanded: bool })),
  categoriesSearchResult: arrayOf(shape({ path: string, title: string })),
  searchQuery: string,
  selectedCategoryPath: string,
};

export default CustomBookCategoryModal;
