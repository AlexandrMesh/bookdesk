import React from 'react';
import { arrayOf, shape, string, number, func } from 'prop-types';
import { SectionList, Platform, UIManager, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Spinner } from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { PAGE_SIZE } from '~constants/bookList';
import BookItem from '../BookItem';
import ItemPlaceholder from '../ItemPlaceholder';
import styles from '../styles';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BookList = ({ data, loadMoreBooks = () => undefined, showModal, selectBook, loadingDataStatus }) => {
  const { t } = useTranslation('common');

  const getSpinner = () =>
    loadingDataStatus === PENDING ? (
      <View style={styles.listFooterComponent}>
        <Spinner />
      </View>
    ) : null;

  return (
    <View style={styles.container}>
      <SectionList
        initialNumToRender={PAGE_SIZE}
        sections={data}
        onEndReached={() => {
          if (loadingDataStatus !== PENDING) {
            loadMoreBooks();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={getSpinner}
        ListEmptyComponent={
          <>
            <ItemPlaceholder />
            <ItemPlaceholder />
            <ItemPlaceholder />
          </>
        }
        renderItem={({ item }) => <BookItem itemStyle={styles.bookItem} bookItem={item} showModal={showModal} selectBook={selectBook} />}
        renderSectionHeader={({ section }) => (
          <View style={styles.stickyHeader}>
            <View style={styles.headerTitle}>
              <Text style={styles.headerTitleText}>{section.title}</Text>
            </View>
            <View style={[styles.taskCount, styles.headerTitle]}>
              <Text style={styles.headerTitleText}>{t('count', { count: section.count })}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

BookList.propTypes = {
  data: arrayOf(
    shape({
      _id: string,
      bookId: string,
      title: string,
      authorsList: arrayOf(string),
      bookStatus: string,
      categoryPath: string,
      coverPath: string,
      votesCount: number,
      status: string,
      added: number,
    }),
  ).isRequired,
  loadMoreBooks: func,
  showModal: func.isRequired,
  selectBook: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
};

export default BookList;
