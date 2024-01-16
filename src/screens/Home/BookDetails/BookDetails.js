import React, { useState, useEffect } from 'react';
import { shape, func, string, number, arrayOf, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Pressable, ScrollView, SafeAreaView, Text, Image } from 'react-native';
import { useRoute, useIsFocused } from '@react-navigation/native';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { Spinner, Size } from '~UI/Spinner';
import Button from '~UI/Button';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { SECONDARY } from '~constants/themes';
import { IMG_URL } from '~config/api';
import { getValidationFailure, validationTypes } from '~utils/validation';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import Input from '~UI/TextInput';
import { DROPDOWN_ICON, LIKE_ICON } from '~constants/dimensions';
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

const BookDetails = ({
  loadingDataStatus,
  loadBookDetails,
  bookDetailsData,
  updateBookVotes,
  bookWithVote,
  updatingVoteForBook,
  showModal,
  selectBook,
  clearBookDetails,
  setBookToUpdate,
  setBookValuesToUpdate,
  showDateUpdater,
  bookValuesUpdatingStatus,
}) => {
  const { t, i18n } = useTranslation(['books', 'categories']);
  const { language } = i18n;
  const isFocused = useIsFocused();
  const [isCommentEditFormVisible, setIsCommentEditFormVisible] = useState(false);
  const [editedComment, setEditedComment] = useState('');
  const [editedCommentError, setEditedCommentError] = useState('');

  const displayEditCommentForm = () => setIsCommentEditFormVisible(true);
  const hideEditCommentForm = () => setIsCommentEditFormVisible(true);

  const { params } = useRoute();

  const { title, coverPath, authorsList, pages, categoryPath, categoryValue, bookStatus, added, annotation, votesCount, comment, commentAdded } =
    bookDetailsData || {};

  const statusColor = getStatusColor(bookStatus);

  useEffect(() => {
    loadBookDetails({ bookId: params?.bookId });
  }, [loadBookDetails, params]);

  useEffect(() => {
    if (!isFocused) {
      clearBookDetails();
    }
  }, [isFocused, clearBookDetails]);

  const handleChangeStatus = () => {
    showModal(BOOK_STATUS);
    selectBook({ authorsList, title, coverPath, pages, votesCount, categoryPath, bookId: params?.bookId, categoryValue, added, bookStatus });
  };

  const handleAddedPress = () => {
    setBookToUpdate(params?.bookId, bookStatus);
    setBookValuesToUpdate(added);
    showDateUpdater();
  };

  const handleChangeComment = (value) => {
    setEditedComment(value);
    setEditedCommentError(null);
  };

  const validateComment = () => {
    const params = {
      minLength: 20,
      maxLength: 1000,
    };
    const error = getValidationFailure(
      editedComment.trim(),
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    setEditedCommentError(error ? t(`errors:${error}`, params) : null);
    return !error;
  };

  const handleEditComment = () => {
    const isCommentValid = validateComment();

    if (isCommentValid) {
      console.log('edit comment');
    }
  };

  return loadingDataStatus === IDLE || loadingDataStatus === PENDING ? (
    <View style={styles.spinnerWrapper}>
      <Spinner />
    </View>
  ) : (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            style={styles.cover}
            source={{
              uri: IMG_URL(`${coverPath}.webp`),
            }}
          />
          <Text style={[styles.title, styles.lightColor]}>{title}</Text>
          {authorsList?.length > 0 &&
            authorsList.map((author) => (
              <View key={author}>
                <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
              </View>
            ))}
        </View>
        <View styles={styles.info}>
          <Text style={[styles.item, styles.lightColor, styles.marginTop]}>{t(`categories:${categoryValue}`)}</Text>
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
                {bookValuesUpdatingStatus === PENDING ? (
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
          <View style={styles.bookStatusWrapper}>
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
              <View style={styles.votesSpinnerWrapper}>
                <Spinner size={Size.SMALL} />
              </View>
            ) : (
              <Pressable
                onPress={() => updateBookVotes({ bookId: params?.bookId, shouldAdd: !bookWithVote, bookStatus })}
                style={styles.ratingWrapper}
              >
                {bookWithVote ? (
                  <LikeFillIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
                ) : (
                  <LikeIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
                )}
                <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
              </Pressable>
            )}
          </View>
          {comment && (
            <View style={[styles.bordered, styles.marginTop]}>
              <View style={styles.blockHeader}>
                <Text style={[styles.item, styles.mediumColor]}>{t('comment')}</Text>
                <Text style={[styles.item, styles.mediumColor]}>{new Date(commentAdded).toLocaleDateString(language)}</Text>
              </View>
              {isCommentEditFormVisible ? (
                <Input
                  placeholder={t('books:enterComment')}
                  wrapperClassName={styles.commentWrapperClassName}
                  className={styles.commentInput}
                  onChangeText={handleChangeComment}
                  value={editedComment}
                  error={editedCommentError}
                  shouldDisplayClearButton={!!editedComment}
                  onClear={() => setEditedComment('')}
                  multiline
                  numberOfLines={5}
                />
              ) : (
                <Text style={[styles.comment, styles.lightColor]}>{comment}</Text>
              )}
              <View style={styles.borderedBlockFooter}>
                {isCommentEditFormVisible ? (
                  <>
                    <Button
                      style={styles.commentButton}
                      titleStyle={styles.commentButtonTitle}
                      onPress={handleEditComment}
                      title={t('common:save')}
                    />
                    <Button
                      theme={SECONDARY}
                      style={styles.commentButton}
                      titleStyle={styles.commentButtonTitle}
                      onPress={hideEditCommentForm}
                      title={t('common:cancel')}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      style={styles.commentButton}
                      titleStyle={styles.commentButtonTitle}
                      onPress={displayEditCommentForm}
                      title={t('common:edit')}
                    />
                    <Button
                      theme={SECONDARY}
                      style={styles.commentButton}
                      titleStyle={styles.commentButtonTitle}
                      onPress={() => undefined}
                      title={t('common:remove')}
                    />
                  </>
                )}
              </View>
            </View>
          )}
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
  bookValuesUpdatingStatus: loadingDataStatusShape,
  loadBookDetails: func.isRequired,
  updateBookVotes: func.isRequired,
  setBookToUpdate: func.isRequired,
  setBookValuesToUpdate: func.isRequired,
  showDateUpdater: func.isRequired,
  showModal: func.isRequired,
  selectBook: func.isRequired,
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
  bookWithVote: bool,
  updatingVoteForBook: bool,
};

export default BookDetails;
