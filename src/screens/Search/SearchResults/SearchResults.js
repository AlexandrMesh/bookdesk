import React, { useEffect } from 'react';
import { string, func, bool, arrayOf, shape, number } from 'prop-types';
import { View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import EmptyResults from '~screens/Home/EmptyResults';
import { Spinner } from '~UI/Spinner';
import TotalCount from '~screens/Home/ActionBar/TotalCount';
import { IDLE } from '~constants/loadingStatuses';
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
  hasNextPage,
  totalItems,
  shouldReloadData,
  setBoardType,
  clearBoardType,
}) => {
  const { t } = useTranslation('search');
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setBoardType();
    } else {
      clearBoardType();
    }
  }, [isFocused, setBoardType, clearBoardType]);

  useEffect(() => {
    if (!isEmpty(searchQuery)) {
      loadSearchResults(false);
    }
  }, [searchQuery, loadSearchResults]);

  if (isEmpty(searchQuery)) {
    return (
      <View style={styles.wrapper}>
        <View>
          <Text style={styles.label}>{t('findBook')}</Text>
        </View>
      </View>
    );
  }
  if (loadingDataStatus === IDLE || shouldReloadData) {
    return (
      <View style={styles.wrapper}>
        <Spinner />
      </View>
    );
  }
  if (searchResult.length > 0) {
    return (
      <>
        <TotalCount count={totalItems} />
        <BooksList searchText={searchQuery} boardType={ALL} loadMoreBooks={loadMoreSearchResults} data={searchResult} hasNextPage={hasNextPage} />
      </>
    );
  }
  if (searchResult.length === 0) {
    return <EmptyResults />;
  }
  return undefined;
};

SearchResults.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  searchQuery: string.isRequired,
  loadSearchResults: func.isRequired,
  loadMoreSearchResults: func.isRequired,
  shouldReloadData: bool.isRequired,
  hasNextPage: bool.isRequired,
  setBoardType: func.isRequired,
  clearBoardType: func.isRequired,
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
