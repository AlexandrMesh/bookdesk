/* eslint-disable react/display-name */
import React, { memo, useCallback } from 'react';
import { any, shape, string, number, arrayOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Button from '~UI/Button';
import { BOOK_DETAILS_ROUTE } from '~constants/routes';
import { deriveUserBookRating } from '~redux/selectors/books';
import Rating from '~UI/Rating';
import Like from '~UI/Like';
import Dropdown from '~UI/Dropdown';
import ModifiedDate from '../../ModifiedDate';
import styles from './styles';

const BookItem = memo(
  ({ bookItem, itemStyle, imgUrl }) => {
    const { bookId, title, coverPath, pages, categoryValue, authorsList, added, votesCount, bookStatus } = bookItem;
    const { t } = useTranslation(['books', 'categories', 'common']);
    const navigation = useNavigation();
    const bookRating = useSelector(deriveUserBookRating(bookId))?.rating;

    const navigateToBookDetails = useCallback(() => navigation.navigate(BOOK_DETAILS_ROUTE, { bookId }), [bookId, navigation]);

    const getFullImgUrl = useCallback(() => `${imgUrl}/${coverPath}.webp`, [coverPath, imgUrl]);

    return (
      <View style={[styles.wrapper, itemStyle]}>
        <View style={styles.bookItem}>
          <View style={styles.leftSide}>
            <View style={styles.coverWrapper}>
              {imgUrl && (
                <FastImage
                  style={styles.cover}
                  source={{
                    uri: getFullImgUrl(),
                  }}
                />
              )}
            </View>
            <View>
              <Button style={styles.more} titleStyle={styles.moreTitle} title={t('common:moreDetails')} onPress={navigateToBookDetails} />
              <Dropdown bookStatus={bookStatus} bookId={bookId} dropdownHeight={150} dropdownLeftPosition={16} />
            </View>
          </View>
          <View style={styles.rightSide}>
            <Text style={[styles.title, styles.lightColor]}>{title}</Text>
            {authorsList.length > 0 &&
              authorsList.map(
                (author, index) =>
                  index < 2 && (
                    // eslint-disable-next-line react/no-array-index-key
                    <View key={`${author}_${index}`} style={styles.authorBlock}>
                      <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
                    </View>
                  ),
              )}
            <View style={styles.info}>
              <Text style={[styles.lightColor]}>{t(`categories:${categoryValue}`)}</Text>
              {!!pages && (
                <Text style={[styles.pagesBlock, styles.item, styles.mediumColor]}>
                  {t('pages')}
                  <Text style={styles.lightColor}>{pages}</Text>
                </Text>
              )}
              {bookStatus && (
                <>
                  <View style={styles.dateWrapper}>
                    <Text style={[styles.item, styles.mediumColor]}>{t('added')}</Text>
                    <ModifiedDate bookId={bookId} bookStatus={bookStatus} added={added} />
                  </View>
                  <Rating bookId={bookId} wrapperStyle={styles.ratingWrapper} rating={bookRating} width={28} height={28} />
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.bottom}>
          <View>
            <Like bookId={bookId} votesCount={votesCount} bookStatus={bookStatus} />
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.bookItem.votesCount === nextProps.bookItem.votesCount &&
      prevProps.bookItem.bookStatus === nextProps.bookItem.bookStatus &&
      prevProps.bookItem.added === nextProps.bookItem.added
    );
  },
);

BookItem.propTypes = {
  imgUrl: string,
  bookItem: shape({
    _id: string,
    bookId: string,
    title: string,
    authorsList: arrayOf(string),
    bookStatus: string,
    categoryPath: string,
    coverPath: string,
    votesCount: number,
    status: string,
    pages: number,
    added: number,
  }).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  itemStyle: any,
};

export default BookItem;
