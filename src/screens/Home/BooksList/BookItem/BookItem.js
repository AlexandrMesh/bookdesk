import React from 'react';
import { shape, func, string, number, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, Pressable } from 'react-native';
import Button from '~UI/Button';
import { Spinner, Size } from '~UI/Spinner';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { IMG_URL } from '~config/api';
import { SECONDARY } from '~constants/themes';
import { BOOK_STATUS } from '~constants/modalTypes';
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

const BookItem = ({ bookItem, showModal, selectBook, bookWithVote, updateBookVotes, updatingVoteForBook }) => {
  const { t } = useTranslation(['books', 'categories']);

  const { bookId, title, coverPath, votesCount, pages, categoryValue, authorsList, added, bookStatus } = bookItem;

  const statusColor = getStatusColor(bookStatus);

  const handleChangeStatus = () => {
    showModal(BOOK_STATUS);
    selectBook(bookItem);
  };

  return (
    <View style={styles.bookItem}>
      <View style={styles.leftSide}>
        <Image
          style={styles.cover}
          source={{
            uri: IMG_URL(`${coverPath}.webp`),
          }}
        />
      </View>
      <View style={styles.rightSide}>
        <View style={styles.titleWrapper}>
          <Text style={[styles.title, styles.lightColor]}>{title}</Text>
        </View>
        {authorsList.map((author) => (
          <View key={author}>
            <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
          </View>
        ))}
        <View style={styles.info}>
          <Text style={styles.lightColor}>{t(`categories:${categoryValue}`)}</Text>
          {pages && (
            <Text style={[styles.item, styles.mediumColor]}>
              {t('pages')}
              <Text style={styles.lightColor}>{pages}</Text>
            </Text>
          )}
          {bookStatus && (
            <Text style={[styles.item, styles.mediumColor]}>
              {t('added')}
              <Text style={styles.lightColor}>{new Date(added).toLocaleDateString('ru-RU')}</Text>
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title={t(bookStatus) || t('noStatus')}
            style={[styles.statusButton, { borderColor: statusColor }]}
            titleStyle={[styles.buttonTitle, { color: statusColor }]}
            icon={<DropdownIcon width='16' height='16' style={{ fill: statusColor }} />}
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
              {bookWithVote ? <LikeFillIcon width='26' height='26' /> : <LikeIcon width='26' height='26' />}
              <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

BookItem.propTypes = {
  bookItem: shape({
    _id: string,
    bookId: string,
    title: string,
    bookStatus: string,
    categoryPath: string,
    coverPath: string,
    votesCount: number,
    status: string,
    pages: number,
    added: number,
  }).isRequired,
  showModal: func.isRequired,
  selectBook: func.isRequired,
  updateBookVotes: func.isRequired,
  bookWithVote: bool,
  updatingVoteForBook: bool,
};

export default BookItem;
