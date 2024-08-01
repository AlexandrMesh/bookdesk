import React, { useEffect } from 'react';
import { string, func, bool, arrayOf, shape, number } from 'prop-types';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import EmptyResults from '~screens/Home/EmptyResults';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import { PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import BooksList from '~screens/Home/BooksList';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import styles from './styles';

const SearchResults = ({
  loadingDataStatus,
  searchQuery,
  loadSearchResults,
  loadMoreSearchResults,
  searchResult,
  totalItems,
  shouldReloadData,
  setBoardType,
}) => {
  const { t } = useTranslation('search');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setBoardType();
    }
  }, [isFocused, setBoardType]);

  useEffect(() => {
    if (!isEmpty(searchQuery) && shouldReloadData) {
      loadSearchResults(false);
    }
  }, [searchQuery, loadSearchResults, shouldReloadData]);

  if (isEmpty(searchQuery)) {
    return (
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.label}>{t('findBook')}</Text>
        </View>
      </View>
    );
  }

  if (searchResult.length === 0 && loadingDataStatus === SUCCEEDED && !shouldReloadData) {
    return <EmptyResults />;
  }

  return (
    <>
      {loadingDataStatus === PENDING ? null : <TotalCount count={searchResult.length > 0 ? totalItems : 0} />}
      <BooksList
        searchText={searchQuery}
        boardType={ALL}
        loadMoreBooks={loadMoreSearchResults}
        data={searchResult}
        loadingDataStatus={loadingDataStatus}
      />
    </>
  );
};

SearchResults.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  searchQuery: string.isRequired,
  loadSearchResults: func.isRequired,
  loadMoreSearchResults: func.isRequired,
  shouldReloadData: bool.isRequired,
  setBoardType: func.isRequired,
  searchResult: arrayOf(
    shape({
      _id: string,
      title: string,
      categoryPath: string,
      coverPath: string,
      votesCount: number,
      type: string,
    }),
  ).isRequired,
  totalItems: number.isRequired,
};

export default SearchResults;
