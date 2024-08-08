import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, SectionList, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import CheckBox from '~UI/CheckBox';
import SlideMenu from '~UI/SlideMenu';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { FILTER_ICON } from '~constants/dimensions';
import { useAppDispatch, useAppSelector } from '~hooks';
import {
  getActiveModal,
  deriveCategories,
  deriveEditableIndeterminatedCategories,
  getBoardType,
  deriveBookListEditableFilterParams,
  deriveCategorySearchQuery,
  deriveCategoriesSearchResult,
} from '~redux/selectors/books';
import {
  triggerReloadBookList,
  toggleExpandedCategory,
  manageFilters,
  clearFilters,
  populateFilters,
  hideModal,
  resetCategories,
  searchCategory,
  clearSearchQueryForCategory,
} from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import { FILTERING } from '~constants/modalTypes';
import { BookStatus } from '~types/books';
import ArrowDown from '~assets/arrow-down.svg';
import styles from './styles';

const FilteringModal = () => {
  const { t } = useTranslation(['common', 'categories']);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const dispatch = useAppDispatch();

  const _manageFilters = useCallback(
    (path: string, boardType: BookStatus, categoryPaths: string[]) => dispatch(manageFilters(path, boardType, categoryPaths)),
    [dispatch],
  );
  const applyFilters = (boardType: BookStatus) => {
    dispatch(populateFilters(boardType));
    dispatch(triggerReloadBookList(boardType));
  };
  const _toggleExpandedCategory = useCallback(
    (path: string, boardType: BookStatus) => dispatch(toggleExpandedCategory({ path, boardType })),
    [dispatch],
  );
  const _clearFilters = (boardType: BookStatus) => dispatch(clearFilters(boardType));
  const onClose = () => {
    dispatch(hideModal());
    dispatch(resetCategories(ALL));
  };
  const _searchCategory = (query: string) => dispatch(searchCategory({ boardType: ALL, query }));
  const _clearSearchQueryForCategory = () => dispatch(clearSearchQueryForCategory(ALL));

  const isVisible = useAppSelector(getActiveModal) === FILTERING;
  const boardType = useAppSelector(getBoardType) as BookStatus;
  const categories = useAppSelector(deriveCategories(ALL));
  const indeterminatedCategories = useAppSelector(deriveEditableIndeterminatedCategories(ALL));
  const filterParams = useAppSelector(deriveBookListEditableFilterParams(ALL));
  const searchQuery = useAppSelector(deriveCategorySearchQuery(ALL));
  const categoriesSearchResult = useAppSelector(deriveCategoriesSearchResult(ALL));

  const handleFilter = () => {
    applyFilters(boardType);
    setShouldAutoClose(true);
  };

  const handleClearFilters = () => {
    _clearFilters(boardType);
  };

  const { categoryPaths } = filterParams;

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
      const indeterminate = indeterminatedCategories.includes(path);

      return (
        <View key={path} style={[styles.menuItem, isSearchResult && styles.searchResult]}>
          {!isSearchResult && (
            <Pressable
              disabled={!shouldDisplayArrowIcon}
              onPress={() => _toggleExpandedCategory(path, boardType)}
              style={[styles.arrowIconWrapper, iconWrapperStyle()]}
            >
              {shouldDisplayArrowIcon ? (
                <ArrowDown style={isExpanded ? null : styles.collapsed} width={FILTER_ICON.width} height={FILTER_ICON.height} />
              ) : null}
            </Pressable>
          )}
          <Pressable style={styles.labelWrapper} onPress={() => _manageFilters(path, boardType, categoryPaths)}>
            <Text style={styles.menuItemTitle}>{t(`categories:${value}`)}</Text>
            <CheckBox isChecked={categoryPaths.includes(path)} indeterminate={indeterminate} />
          </Pressable>
        </View>
      );
    },
    [boardType, categoryPaths, indeterminatedCategories, _manageFilters, t, _toggleExpandedCategory],
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
        onChangeText={_searchCategory}
        value={searchQuery}
        validateable={false}
        shouldDisplayClearButton={!!searchQuery}
        onClear={_clearSearchQueryForCategory}
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

export default FilteringModal;
