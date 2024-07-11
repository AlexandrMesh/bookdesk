import React, { useState, useEffect } from 'react';
import { any, shape, func, string, number, bool, arrayOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, Pressable, Animated } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Button from '~UI/Button';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { getImgUrl } from '~config/api';
import { SECONDARY } from '~constants/themes';
import { BOOK_DETAILS_ROUTE } from '~constants/routes';
import { DROPDOWN_ICON, LIKE_ICON } from '~constants/dimensions';
import { BOOK_STATUS } from '~constants/modalTypes';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { deriveUserBookRating } from '~redux/selectors/books';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import Rating from '~UI/Rating';
import LikeIcon from '~assets/like.svg';
import LikeFillIcon from '~assets/like_fill.svg';
import DropdownIcon from '~assets/dropdown.svg';
import colors from '~styles/colors';
import styles from './styles';

const getStatusColor = (bookStatus) =>
  ({
    [PLANNED]: colors.planned,
    [IN_PROGRESS]: colors.in_progress,
    [COMPLETED]: colors.completed,
  }[bookStatus] || colors.neutral_light);

const BookItem = ({
  bookItem,
  showModal,
  selectBook,
  bookWithVote,
  updateBookVotes,
  updatingVoteForBook,
  setBookToUpdate,
  setBookValuesToUpdate,
  showDateUpdater,
  bookValuesUpdatingStatus,
  bookIdToUpdateAddedDate,
  itemStyle,
  updateUserBookRating,
}) => {
  const { bookId, title, coverPath, votesCount, pages, categoryValue, authorsList, added, bookStatus } = bookItem;
  const { t, i18n } = useTranslation(['books', 'categories', 'common']);
  const { language } = i18n;
  const navigation = useNavigation();
  const [imgUrl, setImgUrl] = useState('');
  const [updatingRating, setUpdatingRating] = useState(false);
  const bookRating = useSelector(deriveUserBookRating(bookId))?.rating;

  const statusColor = getStatusColor(bookStatus);

  const handleChangeStatus = () => {
    showModal(BOOK_STATUS);
    selectBook(bookItem);
  };

  const handleAddedPress = () => {
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

  const animatedStyleForVotes = useGetAnimatedPlaceholderStyle(updatingVoteForBook);
  const animatedStyleForDate = useGetAnimatedPlaceholderStyle(bookIdToUpdateAddedDate === bookId && bookValuesUpdatingStatus === PENDING);

  const handleUpdateRating = async (value) => {
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
    <View style={[styles.wrapper, itemStyle]}>
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
              <Text style={[styles.item, styles.mediumColor]}>
                {t('added')}
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
              </Text>
            )}
            {bookStatus && (
              <Rating
                rating={bookRating}
                onChangeRating={handleUpdateRating}
                wrapperStyle={styles.ratingWrapper}
                isLoading={updatingRating}
                width={28}
                height={28}
              />
            )}
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <View>
          <Button style={styles.more} titleStyle={styles.moreTitle} title={t('common:moreDetails')} onPress={navigateToBookDetails} />
          <Button
            title={t(bookStatus) || t('noStatus')}
            style={[styles.statusButton, { borderColor: statusColor }]}
            titleStyle={[styles.buttonTitle, { color: statusColor }]}
            icon={<DropdownIcon width={DROPDOWN_ICON.width} height={DROPDOWN_ICON.height} style={{ fill: statusColor }} />}
            iconPosition='right'
            iconClassName={styles.buttonIcon}
            theme={SECONDARY}
            onPress={handleChangeStatus}
          />
        </View>
        <View>
          <Animated.View style={updatingVoteForBook ? { opacity: animatedStyleForVotes } : {}}>
            <Pressable onPress={async () => updateBookVotes({ bookId, shouldAdd: !bookWithVote, bookStatus })} style={styles.votesWrapper}>
              {bookWithVote ? (
                <LikeFillIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
              ) : (
                <LikeIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
              )}
              <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
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
  showModal: func.isRequired,
  updateUserBookRating: func.isRequired,
  setBookToUpdate: func.isRequired,
  setBookValuesToUpdate: func.isRequired,
  showDateUpdater: func.isRequired,
  selectBook: func.isRequired,
  updateBookVotes: func.isRequired,
  bookWithVote: bool,
  bookIdToUpdateAddedDate: string,
  updatingVoteForBook: bool,
  // eslint-disable-next-line react/forbid-prop-types
  itemStyle: any,
};

export default BookItem;
