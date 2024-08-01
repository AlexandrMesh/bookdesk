import React, { useEffect } from 'react';
import { shape, func, string, number, arrayOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { View, SafeAreaView, Text, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import Rating from '~UI/Rating';
import Like from '~UI/Like';
import Dropdown from '~UI/Dropdown';
import { deriveUserBookRating } from '~redux/selectors/books';
import useGetImgUrl from '~hooks/useGetImgUrl';
import Comment from './Comment';
import ModifiedDate from '../ModifiedDate';
import Placeholder from './Placeholder';
import styles from './styles';

const BookDetails = ({ loadingDataStatus, loadBookDetails, bookDetailsData, clearBookDetails }) => {
  const { title, coverPath, authorsList, pages, categoryValue, bookStatus, added, votesCount, annotation } = bookDetailsData || {};
  const { t } = useTranslation(['books', 'categories', 'common']);
  const imgUrl = useGetImgUrl();
  const isFocused = useIsFocused();

  const { params } = useRoute();

  const bookRating = useSelector(deriveUserBookRating(params?.bookId))?.rating;

  useEffect(() => {
    loadBookDetails({ bookId: params?.bookId });
  }, [loadBookDetails, params]);

  useEffect(() => {
    if (!isFocused) {
      clearBookDetails();
    }
  }, [isFocused, clearBookDetails]);

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
          {authorsList?.length > 0 &&
            authorsList.map((author) => (
              <View key={author}>
                <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
              </View>
            ))}
        </View>
        <View>
          <View style={styles.bookStatusWrapper}>
            <Dropdown
              bookStatus={bookStatus}
              bookId={params?.bookId}
              dropdownHeight={150}
              wrapperStyle={styles.statusButton}
              buttonLabelStyle={styles.buttonTitle}
            />
            <Like bookId={params?.bookId} bookStatus={bookStatus} votesCount={votesCount} />
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
                <ModifiedDate bookId={params?.bookId} bookStatus={bookStatus} added={added} fontSize={18} height={25} />
              </Text>
            )}
          </View>

          {bookStatus ? (
            <View style={[styles.bordered, styles.marginTop]}>
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

          {bookStatus ? <Comment /> : null}
          {annotation && (
            <View style={[styles.item, styles.mediumColor, styles.marginTop]}>
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

BookDetails.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  loadBookDetails: func.isRequired,
  clearBookDetails: func.isRequired,
  bookDetailsData: shape({
    title: string,
    authorsList: arrayOf(string),
    bookStatus: string,
    categoryPath: string,
    coverPath: string,
    votesCount: number,
    status: string,
    pages: number,
    added: number,
    annotation: string,
  }),
};

export default BookDetails;
