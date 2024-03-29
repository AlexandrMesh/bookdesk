import React from 'react';
import { any, shape, func, string, number, bool, arrayOf } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '~UI/Button';
import { Spinner, Size } from '~UI/Spinner';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { IMG_URL } from '~config/api';
import { SECONDARY } from '~constants/themes';
import { BOOK_DETAILS_ROUTE } from '~constants/routes';
import { DROPDOWN_ICON, LIKE_ICON } from '~constants/dimensions';
import { BOOK_STATUS } from '~constants/modalTypes';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
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
}) => {
  const { t, i18n } = useTranslation(['books', 'categories']);
  const { language } = i18n;
  const navigation = useNavigation();

  const { bookId, title, coverPath, votesCount, pages, categoryValue, authorsList, added, bookStatus } = bookItem;

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

  return (
    <View style={[styles.bookItem, itemStyle]}>
      <View style={styles.leftSide}>
        <Pressable onPress={navigateToBookDetails}>
          <Image
            style={styles.cover}
            source={{
              uri: IMG_URL(`${coverPath}.webp`),
            }}
          />
        </Pressable>
      </View>
      <View style={styles.rightSide}>
        <Pressable onPress={navigateToBookDetails} style={styles.titleWrapper}>
          <Text style={[styles.title, styles.lightColor]}>{title}</Text>
        </Pressable>
        {authorsList.length > 0 &&
          authorsList.map(
            (author, index) =>
              index < 2 && (
                // eslint-disable-next-line react/no-array-index-key
                <View key={`${author}_${index}`}>
                  <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
                </View>
              ),
          )}
        <View style={styles.info}>
          <Text style={styles.lightColor}>{t(`categories:${categoryValue}`)}</Text>
          {!!pages && (
            <Text style={[styles.item, styles.mediumColor]}>
              {t('pages')}
              <Text style={styles.lightColor}>{pages}</Text>
            </Text>
          )}
          {bookStatus && (
            <Text style={[styles.item, styles.mediumColor]}>
              {t('added')}

              <View style={styles.addedContainer}>
                {bookIdToUpdateAddedDate === bookId && bookValuesUpdatingStatus === PENDING ? (
                  <Spinner size={Size.SMALL} />
                ) : (
                  <View style={styles.addedWrapper}>
                    <Text onPress={handleAddedPress} style={[styles.item, styles.lightColor]}>
                      {new Date(added).toLocaleDateString(language)}
                    </Text>
                  </View>
                )}
              </View>
            </Text>
          )}
        </View>

        <View style={styles.footer}>
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
          {updatingVoteForBook ? (
            <View style={styles.spinnerWrapper}>
              <Spinner size={Size.SMALL} />
            </View>
          ) : (
            <Pressable onPress={() => updateBookVotes({ bookId, shouldAdd: !bookWithVote, bookStatus })} style={styles.ratingWrapper}>
              {bookWithVote ? (
                <LikeFillIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
              ) : (
                <LikeIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
              )}
              <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
            </Pressable>
          )}
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
