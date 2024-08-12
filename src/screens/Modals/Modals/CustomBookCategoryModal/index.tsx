import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, SectionList, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import RadioButton from '~UI/RadioButton';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { FILTER_ICON } from '~constants/dimensions';
import { getActiveModal, deriveCategories } from '~redux/selectors/books';
import { hideModal } from '~redux/actions/booksActions';
import { toggleExpandedCategoryCustomBooks, setSearchQuery, selectCategory, clearCategory, submitCategory } from '~redux/actions/customBookActions';
import { deriveCategoriesSearchResult, getCategorySearchQuery, getEditableSelectedCategoryPath } from '~redux/selectors/customBook';
import { useAppDispatch, useAppSelector } from '~hooks';
import { CUSTOM_BOOK_CATEGORY } from '~constants/modalTypes';
import { ALL } from '~constants/boardType';
import ArrowDown from '~assets/arrow-down.svg';
import styles from './styles';

const CustomBookCategoryModal = () => {
  const { t } = useTranslation(['common', 'categories']);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const dispatch = useAppDispatch();
  const _toggleExpandedCategory = useCallback((path: string) => dispatch(toggleExpandedCategoryCustomBooks(path)), [dispatch]);
  const onClose = () => {
    dispatch(hideModal());
    dispatch(clearCategory());
  };
  const _selectCategory = useCallback((category: { path: string; label: string }) => dispatch(selectCategory(category)), [dispatch]);
  const _setSearchQuery = (query: string) => dispatch(setSearchQuery(query));
  const clearSearchQueryForCategory = () => dispatch(setSearchQuery(''));
  const _submitCategory = () => dispatch(submitCategory());

  const isVisible = useAppSelector(getActiveModal) === CUSTOM_BOOK_CATEGORY;
  const categories = useAppSelector(deriveCategories(ALL, true));
  const searchQuery = useAppSelector(getCategorySearchQuery);
  const categoriesSearchResult = useAppSelector(deriveCategoriesSearchResult);
  const selectedCategoryPath = useAppSelector(getEditableSelectedCategoryPath);

  const handleSave = () => {
    setShouldAutoClose(true);
    _submitCategory();
  };

  const shouldDisplaySearchResults = searchQuery;

  const emptySearchResult = () => (
    <View style={styles.emptyResult}>
      <Text style={styles.emptyLabel}>{t('noCategories')}</Text>
    </View>
  );

  const renderCategoryItem = useCallback(
    ({ value, path, isExpanded, isSearchResult }: any) => {
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
              onPress={() => _toggleExpandedCategory(path)}
              style={[styles.arrowIconWrapper, iconWrapperStyle()]}
            >
              {shouldDisplayArrowIcon ? (
                <ArrowDown style={isExpanded ? null : styles.collapsed} width={FILTER_ICON.width} height={FILTER_ICON.height} />
              ) : null}
            </Pressable>
          )}
          <Pressable
            style={styles.labelWrapper}
            onPress={() => (level === 3 ? _selectCategory({ label: value, path }) : _toggleExpandedCategory(path))}
          >
            <Text style={styles.menuItemTitle}>{t(`categories:${value}`)}</Text>
            {level === 3 && <RadioButton isSelected={selectedCategoryPath === path} />}
          </Pressable>
        </View>
      );
    },
    [_selectCategory, selectedCategoryPath, t, _toggleExpandedCategory],
  );

  const getKeyExtractorForCategory = useCallback((item: any) => item.path, []);

  const renderItemForCategory = useCallback(({ item }: any) => renderCategoryItem({ value: item.title, path: item.path }), [renderCategoryItem]);

  const renderCategory = useCallback(
    ({ value, path, isExpanded, data }: any) => {
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

  const getKeyExtractorForSearch = useCallback((item: any) => item.path, []);

  const renderItemForSearch = useCallback(
    ({ item }: any) => renderCategoryItem({ value: item.title, path: item.path, isSearchResult: true }),
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

  const getKeyExtractor = useCallback((item: any) => item.path, []);

  const renderItem = useCallback(
    ({ item, section }: any) =>
      section.isExpanded &&
      renderCategory({ value: item.title, path: item.path, isExpanded: item.isExpanded, data: item.data, section: item.isExpanded }),
    [renderCategory],
  );

  const renderSectionHeader = useCallback(
    ({ section }: any) => renderCategoryItem({ value: section.title, path: section.path, isExpanded: section.isExpanded }),
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
        onChangeText={_setSearchQuery}
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

export default CustomBookCategoryModal;
