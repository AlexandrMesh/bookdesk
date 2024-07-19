import React, { useState, useEffect } from 'react';
import { any, shape, func, string, number, arrayOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Button from '~UI/Button';
import { getImgUrl } from '~config/api';
import { BOOK_DETAILS_ROUTE } from '~constants/routes';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { deriveUserBookRating } from '~redux/selectors/books';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import Rating from '~UI/Rating';
import Like from '~UI/Like';
import Dropdown from '~UI/Dropdown';
import styles from './styles';

const BookItem = ({
  bookItem,
  setBookToUpdate,
  setBookValuesToUpdate,
  showDateUpdater,
  bookValuesUpdatingStatus,
  bookIdToUpdateAddedDate,
  itemStyle,
  updateUserBookRating,
}) => {
  const { bookId, title, coverPath, pages, categoryValue, authorsList, added, votesCount, bookStatus } = bookItem;
  const { t, i18n } = useTranslation(['books', 'categories', 'common']);
  const { language } = i18n;
  const navigation = useNavigation();
  const [imgUrl, setImgUrl] = useState('');
  const [updatingRating, setUpdatingRating] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const bookRating = useSelector(deriveUserBookRating(bookId))?.rating;

  const handleAddedPress = () => {
    if (isUpdatingStatus) {
      return;
    }
    setBookToUpdate(bookId, bookStatus);
    setBookValuesToUpdate(added);
    showDateUpdater();
  };

  const navigateToBookDetails = () => navigation.navigate(BOOK_DETAILS_ROUTE, { bookId });

  useEffect(() => {
    async function getData() {
      const response = await getImgUrl();
      setImgUrl(response);
    }
    getData();
  }, []);

  const animatedStyleForDate = useGetAnimatedPlaceholderStyle(bookIdToUpdateAddedDate === bookId && bookValuesUpdatingStatus === PENDING);
  const animatedStyleForBookStatus = useGetAnimatedPlaceholderStyle(isUpdatingStatus);

  const handleUpdateRating = async (value) => {
    if (isUpdatingStatus) {
      return;
    }
    try {
      setUpdatingRating(true);
      const added = new Date().getTime();
      await updateUserBookRating({ bookId, rating: value, added });
      setUpdatingRating(false);
    } catch (error) {
      setUpdatingRating(false);
    }
  };

  return (
    <Animated.View style={[styles.wrapper, itemStyle, isUpdatingStatus ? { opacity: animatedStyleForBookStatus } : {}]}>
      <View style={styles.bookItem}>
        <View style={styles.leftSide}>
          {imgUrl && (
            <Image
              style={styles.cover}
              source={{
                uri: `${imgUrl}/${coverPath}.webp`,
              }}
            />
          )}
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
                  <Animated.View
                    style={[
                      styles.addedContainer,
                      bookIdToUpdateAddedDate === bookId && bookValuesUpdatingStatus === PENDING ? { opacity: animatedStyleForDate } : {},
                    ]}
                  >
                    <View style={styles.addedWrapper}>
                      <Text onPress={handleAddedPress} style={[styles.item, styles.lightColor]}>
                        {new Date(added).toLocaleDateString(language)}
                      </Text>
                    </View>
                  </Animated.View>
                </View>
                <Rating
                  wrapperStyle={styles.ratingWrapper}
                  rating={bookRating}
                  onChangeRating={handleUpdateRating}
                  isLoading={updatingRating}
                  width={28}
                  height={28}
                />
              </>
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View>
          <Button style={styles.more} titleStyle={styles.moreTitle} title={t('common:moreDetails')} onPress={navigateToBookDetails} />
          <Dropdown
            isLoading={isUpdatingStatus}
            onLoading={setIsUpdatingStatus}
            bookStatus={bookStatus}
            bookId={bookId}
            dropdownHeight={150}
            dropdownLeftPosition={16}
          />
        </View>
        <View>
          <Like bookId={bookId} votesCount={votesCount} bookStatus={bookStatus} />
        </View>
      </View>
    </Animated.View>
  );
};

BookItem.propTypes = {
  bookValuesUpdatingStatus: loadingDataStatusShape,
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
  updateUserBookRating: func.isRequired,
  setBookToUpdate: func.isRequired,
  setBookValuesToUpdate: func.isRequired,
  showDateUpdater: func.isRequired,
  bookIdToUpdateAddedDate: string,
  // eslint-disable-next-line react/forbid-prop-types
  itemStyle: any,
};

export default BookItem;
