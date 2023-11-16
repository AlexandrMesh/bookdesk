import React, { useEffect } from 'react';
import { string, func, bool } from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Input from '~UI/TextInput';
import useDebouncedSearch from '~hooks/useDebouncedSearch';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { PENDING, IDLE } from '~constants/loadingStatuses';
import styles from './styles';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  clearSearchResults,
  shouldClearSearchQuery,
  triggerShouldNotClearSearchQuery,
  loadingDataStatus,
}) => {
  const { t } = useTranslation(['books', 'common', 'search']);
  const [searchQueryValue, handleChangeQuery, clearSearchText, isBusy] = useDebouncedSearch(setSearchQuery, searchQuery, 600);

  const handleClear = () => {
    if (loadingDataStatus === PENDING || loadingDataStatus === IDLE || isBusy) {
      return false;
    }
    clearSearchText();
    clearSearchResults();
    return true;
  };

  useEffect(() => {
    if (shouldClearSearchQuery) {
      clearSearchText();
    }
  }, [clearSearchText, shouldClearSearchQuery]);

  return (
    <View style={styles.wrapper}>
      <Input
        placeholder={t('search:enterSearchQuery')}
        onChangeText={(value) => {
          triggerShouldNotClearSearchQuery();
          handleChangeQuery(value);
        }}
        value={searchQueryValue}
        shouldDisplayClearButton={!!searchQueryValue && !isBusy && loadingDataStatus !== PENDING && loadingDataStatus !== IDLE}
        validateable={false}
        onClear={handleClear}
      />
    </View>
  );
};

SearchBar.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  triggerShouldNotClearSearchQuery: func.isRequired,
  searchQuery: string.isRequired,
  setSearchQuery: func.isRequired,
  clearSearchResults: func.isRequired,
  shouldClearSearchQuery: bool,
};

export default SearchBar;
