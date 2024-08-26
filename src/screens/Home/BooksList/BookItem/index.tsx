/* eslint-disable react/display-name */
import React, { FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import Button from '~UI/Button';
import { BOOK_DETAILS_ROUTE } from '~constants/routes';
import { deriveUserBookRating } from '~redux/selectors/books';
import Rating from '~screens/Home/Rating';
import Like from '~screens/Home/Like';
import BookStatusDropdown from '~screens/Home/BookStatusDropdown';
import BookNotePreview from '~screens/Home/BookNotePreview';
import { BookStatus, IBook } from '~types/books';
import ModifiedDate from '../../ModifiedDate';
import styles from './styles';

export type Props = {
  imgUrl: string;
  bookItem: IBook;
  itemStyle?: StyleProp<ViewStyle>;
};

const BookItem: FC<Props> = memo(
  (book) => {
    const { bookId, title, coverPath, pages, categoryValue, authorsList, added, votesCount, bookStatus } = book.bookItem;
    const { t } = useTranslation(['books', 'categories', 'common']);
    const navigation = useNavigation<any>();
    const bookRating = useSelector(deriveUserBookRating(bookId))?.rating;

    const navigateToBookDetails = useCallback(() => navigation.navigate(BOOK_DETAILS_ROUTE, { bookId }), [bookId, navigation]);

    const getFullImgUrl = useCallback(() => `${book.imgUrl}/${coverPath}.webp`, [coverPath, book.imgUrl]);

    return (
      <View style={[styles.wrapper, book.itemStyle]}>
        <View style={styles.bookItem}>
          <View style={styles.leftSide}>
            <View style={styles.coverWrapper}>
              {book.imgUrl && (
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
              <BookStatusDropdown bookStatus={bookStatus as BookStatus} bookId={bookId} dropdownLeftPosition={16} />
            </View>
          </View>
          <View style={styles.rightSide}>
            <Text style={[styles.title, styles.lightColor]}>{title}</Text>
            {(authorsList as string[]).length > 0 &&
              authorsList?.map(
                (author, index) =>
                  index < 2 && (
                    // eslint-disable-next-line react/no-array-index-key
                    <View key={`${author}_${index}`}>
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
                    <ModifiedDate bookId={bookId} bookStatus={bookStatus} added={added as number} />
                  </View>
                  <Rating bookId={bookId} rating={bookRating} width={28} height={28} />
                </>
              )}
            </View>
            {bookStatus ? <BookNotePreview bookId={bookId} bookTitle={title} /> : null}
          </View>
        </View>
        <View style={styles.bottom}>
          <View>
            <Like bookId={bookId} votesCount={votesCount as number} bookStatus={bookStatus as BookStatus} />
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

export default BookItem;
