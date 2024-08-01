import React, { useCallback } from 'react';
import { View, Text, Animated } from 'react-native';
import { string, number } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getBookValuesUpdatingStatus, getBookToUpdate } from '~redux/selectors/books';
import { PENDING } from '~constants/loadingStatuses';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import { setBookToUpdate, setBookValuesToUpdate, showModal } from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';
import styles from './styles';

const ModifiedDate = ({ bookId, bookStatus, added, fontSize = 15, height = 25 }) => {
  const { i18n } = useTranslation();
  const { language } = i18n;
  const dispatch = useDispatch();
  const bookIdToUpdateAddedDate = useSelector(getBookToUpdate)?.bookId;
  const bookValuesUpdatingStatus = useSelector(getBookValuesUpdatingStatus);

  const handleAddedPress = useCallback(() => {
    dispatch(setBookToUpdate(bookId, bookStatus));
    dispatch(setBookValuesToUpdate(added));
    dispatch(showModal(DATE_UPDATER));
  }, [added, bookId, bookStatus, dispatch]);

  const animatedStyle = useGetAnimatedPlaceholderStyle(bookIdToUpdateAddedDate === bookId && bookValuesUpdatingStatus === PENDING);

  return (
    <Animated.View style={[{ height }, bookIdToUpdateAddedDate === bookId && bookValuesUpdatingStatus === PENDING ? { opacity: animatedStyle } : {}]}>
      <View style={styles.addedWrapper}>
        <Text onPress={handleAddedPress} style={[{ fontSize }, styles.lightColor]}>
          {new Date(added).toLocaleDateString(language)}
        </Text>
      </View>
    </Animated.View>
  );
};

ModifiedDate.propTypes = {
  added: number,
  bookId: string,
  bookStatus: string,
  fontSize: number,
  height: number,
};

export default ModifiedDate;
