import React from 'react';
import { string, func } from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Input from '~UI/TextInput';
import useDebouncedSearch from '~hooks/useDebouncedSearch';
import styles from './styles';

const SearchBar = ({ searchQuery, setSearchQuery, clearSearchResults }) => {
  const { t } = useTranslation(['books', 'common', 'search']);
  const [searchQueryValue, handleChangeQuery, clearSearchText] = useDebouncedSearch(setSearchQuery, searchQuery, 600);

  const handleClear = () => {
    clearSearchText();
    clearSearchResults();
  };

  return (
    <View style={styles.wrapper}>
      <Input
        placeholder={t('search:enterSearchQuery')}
        onChangeText={handleChangeQuery}
        value={searchQueryValue}
        shouldDisplayClearButton={!!searchQueryValue}
        validateable={false}
        onClear={handleClear}
      />
    </View>
  );
};

SearchBar.propTypes = {
  searchQuery: string.isRequired,
  setSearchQuery: func.isRequired,
  clearSearchResults: func.isRequired,
};

export default SearchBar;
