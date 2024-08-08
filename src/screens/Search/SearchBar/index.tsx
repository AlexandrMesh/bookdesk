import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Input from '~UI/TextInput';
import useDebouncedSearch from '~hooks/useDebouncedSearch';
import { PENDING, IDLE } from '~constants/loadingStatuses';
import { deriveSearchQuery, getShouldClearSearchQuery, getLoadingSearchResultsStatus } from '~redux/selectors/books';
import { setSearchQuery, clearSearchResults, triggerShouldNotClearSearchQuery } from '~redux/actions/booksActions';
import { useAppDispatch, useAppSelector } from '~hooks';
import styles from './styles';

const SearchBar = () => {
  const { t } = useTranslation(['books', 'common', 'search']);
  const dispatch = useAppDispatch();

  const _setSearchQuery = (query: string) => dispatch(setSearchQuery(query));
  const _clearSearchResults = () => dispatch(clearSearchResults());
  const _triggerShouldNotClearSearchQuery = () => dispatch(triggerShouldNotClearSearchQuery());

  const searchQuery = useAppSelector(deriveSearchQuery);
  const shouldClearSearchQuery = useAppSelector(getShouldClearSearchQuery);
  const loadingDataStatus = useAppSelector(getLoadingSearchResultsStatus);

  const [searchQueryValue, handleChangeQuery, clearSearchText, isBusy] = useDebouncedSearch(_setSearchQuery, searchQuery, 600);

  const handleClear = () => {
    if (loadingDataStatus === PENDING || loadingDataStatus === IDLE || isBusy) {
      return false;
    }
    (clearSearchText as any)();
    _clearSearchResults();
    return true;
  };

  useEffect(() => {
    if (shouldClearSearchQuery) {
      (clearSearchText as any)();
    }
  }, [clearSearchText, shouldClearSearchQuery]);

  return (
    <View style={styles.wrapper}>
      <Input
        placeholder={t('search:enterSearchQuery')}
        onChangeText={(value) => {
          _triggerShouldNotClearSearchQuery();
          (handleChangeQuery as any)(value);
        }}
        value={searchQueryValue as string}
        shouldDisplayClearButton={!!searchQueryValue && !isBusy && loadingDataStatus !== PENDING && loadingDataStatus !== IDLE}
        validateable={false}
        onClear={handleClear}
      />
    </View>
  );
};

export default SearchBar;
