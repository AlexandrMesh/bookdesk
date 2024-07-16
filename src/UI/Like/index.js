import React, { useState } from 'react';
import { func, number, string } from 'prop-types';
import { useSelector } from 'react-redux';
import { Pressable, Text, Vibration } from 'react-native';
import { deriveBookVotes } from '~redux/selectors/books';
import LikeIcon from '~assets/like.svg';
import LikeFillIcon from '~assets/like_fill.svg';
import { LIKE_ICON } from '~constants/dimensions';
import styles from './styles';

const Like = ({ bookId, votesCount, onLike }) => {
  const [isLoading, setIsloading] = useState(false);
  const bookWithVote = useSelector(deriveBookVotes(bookId));

  const handleLike = async () => {
    if (isLoading) {
      return;
    }
    try {
      Vibration.vibrate(150);
      setIsloading(true);
      await onLike();
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Pressable disabled={isLoading} onPress={handleLike} style={[styles.votesWrapper, { opacity: isLoading ? 0.5 : 1 }]}>
      {bookWithVote ? (
        <LikeFillIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
      ) : (
        <LikeIcon width={LIKE_ICON.width} height={LIKE_ICON.width} />
      )}
      <Text style={[styles.lightColor, styles.votesCount]}>{votesCount}</Text>
    </Pressable>
  );
};

Like.propTypes = {
  bookId: string,
  votesCount: number,
  onLike: func.isRequired,
};

export default Like;
