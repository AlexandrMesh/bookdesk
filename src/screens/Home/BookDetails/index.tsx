import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View, SafeAreaView, Text, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { getLoadingBookDetailsStatus, deriveBookDetails, deriveUserBookRating } from '~redux/selectors/books';
import { clearBookDetails, loadBookDetails } from '~redux/actions/booksActions';
import Rating from '~screens/Home/Rating';
import Like from '~screens/Home/Like';
import BookStatusDropdown from '~screens/Home/BookStatusDropdown';
import { useAppDispatch, useAppSelector } from '~hooks';
import { BookStatus } from '~types/books';
import useGetImgUrl from '~hooks/useGetImgUrl';
import ModifiedDate from '../ModifiedDate';
import Placeholder from './Placeholder';
import BookNotePreview from '../BookNotePreview';
import styles from './styles';

type ParamList = {
  BookDetails: {
    bookId: string;
  };
};

const BookDetails = () => {
  const isFocused = useIsFocused();
  const { params } = useRoute<RouteProp<ParamList, 'BookDetails'>>();

  const bookRating = useAppSelector(deriveUserBookRating(params?.bookId))?.rating;
  const loadingDataStatus = useAppSelector(getLoadingBookDetailsStatus);
  const bookDetailsData = useAppSelector(deriveBookDetails);

  const { title, coverPath, authorsList, pages, categoryValue, bookStatus, added, votesCount, annotation } = bookDetailsData || {};
  const { t } = useTranslation(['books', 'categories', 'common']);
  const imgUrl = useGetImgUrl();

  const dispatch = useAppDispatch();
  const _loadBookDetails = useCallback((bookId: string) => dispatch(loadBookDetails(bookId)), [dispatch]);
  const _clearBookDetails = useCallback(() => dispatch(clearBookDetails()), [dispatch]);

  useEffect(() => {
    _loadBookDetails(params?.bookId);
  }, [_loadBookDetails, params]);

  useEffect(() => {
    if (!isFocused) {
      _clearBookDetails();
    }
  }, [isFocused, _clearBookDetails]);

  return loadingDataStatus === IDLE || loadingDataStatus === PENDING ? (
    <Placeholder />
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
          {imgUrl && (
            <FastImage
              style={styles.cover}
              source={{
                uri: `${imgUrl}/${coverPath}.webp`,
              }}
            />
          )}
          <Text style={[styles.title, styles.lightColor]}>{title}</Text>
          {(authorsList as string[])?.length > 0 &&
            authorsList?.map((author) => (
              <View key={author}>
                <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
              </View>
            ))}
        </View>
        <View>
          <View style={styles.bookStatusWrapper}>
            <BookStatusDropdown
              bookStatus={bookStatus as BookStatus}
              bookId={params?.bookId}
              wrapperStyle={styles.statusButton}
              buttonLabelStyle={styles.buttonTitle}
            />
            <Like bookId={params?.bookId} bookStatus={bookStatus as BookStatus} votesCount={votesCount as number} />
          </View>
          <View style={[styles.info, styles.marginTop]}>
            <Text style={[styles.item, styles.lightColor]}>{t(`categories:${categoryValue}`)}</Text>
            {!!pages && (
              <Text style={[styles.item, styles.mediumColor]}>
                {t('pages')}
                <Text style={styles.lightColor}>{pages}</Text>
              </Text>
            )}
            {bookStatus && (
              <Text style={[styles.item, styles.mediumColor]}>
                {t('added')}
                <ModifiedDate bookId={params?.bookId} bookStatus={bookStatus} added={added as number} fontSize={18} height={25} />
              </Text>
            )}
          </View>

          {bookStatus ? (
            <View style={[styles.info, styles.marginTop]}>
              <View style={styles.blockHeader}>
                <View style={styles.ratingLabel}>
                  <View>
                    <Text style={[styles.item, styles.mediumColor]}>{t('rating')}</Text>
                  </View>
                </View>
                <Rating bookId={params?.bookId} rating={bookRating} />
              </View>
            </View>
          ) : null}

          {bookStatus ? <BookNotePreview bookId={params?.bookId} bookTitle={title} numberOfLines={5} fontSize={18} /> : null}
          {annotation && (
            <View style={styles.marginTop}>
              <View>
                <Text style={[styles.item, styles.mediumColor]}>{t('annotation')}</Text>
              </View>
              <Text style={[styles.annotation, styles.lightColor]}>{annotation}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookDetails;
