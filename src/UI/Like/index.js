import React, { useState, useCallback } from 'react';
import { number, string } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Animated, Pressable, Text, Vibration } from 'react-native';
import { deriveBookVotes } from '~redux/selectors/books';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import { updateBookVotes } from '~redux/actions/booksActions';
import LikeIcon from '~assets/like.svg';
import LikeFillIcon from '~assets/like_fill.svg';
import { LIKE_ICON } from '~constants/dimensions';
import styles from './styles';

const Like = ({ bookId, votesCount, bookStatus }) => {
  const [isLoading, setIsloading] = useState(false);
  const bookWithVote = useSelector(deriveBookVotes(bookId));
  const dispatch = useDispatch();

  const animatedStyle = useGetAnimatedPlaceholderStyle(isLoading);

  const handleLike = useCallback(async () => {
    if (isLoading) {
      return;
    }
    try {
      Vibration.vibrate(70);
      setIsloading(true);
      await dispatch(updateBookVotes({ bookId, shouldAdd: !bookWithVote, bookStatus }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  }, [bookId, bookStatus, bookWithVote, dispatch, isLoading]);

  return (
    <Animated.View style={isLoading ? { opacity: animatedStyle } : {}}>
      <Pressable style={styles.votesWrapper} disabled={isLoading} onPress={handleLike}>
        {bookWithVote ? (
          <LikeFillIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
        ) : (
          <LikeIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
        )}
        <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
      </Pressable>
    </Animated.View>
  );
};

Like.propTypes = {
  bookId: string,
  votesCount: number,
  bookStatus: string,
};

export default Like;
