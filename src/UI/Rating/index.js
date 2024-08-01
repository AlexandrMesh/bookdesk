/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { string, number, any } from 'prop-types';
import { Animated, View, Pressable, Vibration } from 'react-native';
import { useDispatch } from 'react-redux';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import { updateUserBookRating } from '~redux/actions/booksActions';
import FilledStarIcon from '~assets/star-filled.svg';
import StarIcon from '~assets/star.svg';
import styles from './styles';

const Rating = ({ bookId, width = 32, height = 32, wrapperStyle, rating = 0 }) => {
  const [internalBookRating, setInternalBookRating] = useState(rating);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const animatedStyleForRating = useGetAnimatedPlaceholderStyle(isLoading);

  const onChangeRating = useCallback(
    async (value) => {
      try {
        setIsLoading(true);
        const ratingAdded = new Date().getTime();
        await dispatch(updateUserBookRating({ bookId, rating: value, added: ratingAdded }));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [bookId, dispatch],
  );

  const handleChangeRating = useCallback(
    (value) => {
      Vibration.vibrate(70);
      if (value === internalBookRating) {
        const rating = value - 1;
        setInternalBookRating(value - 1);
        onChangeRating(rating);
      } else {
        setInternalBookRating(value);
        onChangeRating(value);
      }
    },
    [internalBookRating, onChangeRating],
  );

  const ratingItems = useMemo(
    () => [
      { id: '1', isSelected: internalBookRating >= 1, action: () => handleChangeRating(1) },
      { id: '2', isSelected: internalBookRating >= 2, action: () => handleChangeRating(2) },
      { id: '3', isSelected: internalBookRating >= 3, action: () => handleChangeRating(3) },
      { id: '4', isSelected: internalBookRating >= 4, action: () => handleChangeRating(4) },
      { id: '5', isSelected: internalBookRating >= 5, action: () => handleChangeRating(5) },
    ],
    [handleChangeRating, internalBookRating],
  );

  useEffect(() => {
    setInternalBookRating(rating);
  }, [rating]);

  useEffect(() => {
    return () => setInternalBookRating(0);
  }, []);

  return (
    <Animated.View style={[styles.wrapper, wrapperStyle, isLoading ? { opacity: animatedStyleForRating } : {}]}>
      <View style={[styles.rating, { height }]}>
        {ratingItems.map(({ id, isSelected, action }) => {
          return (
            <Pressable
              key={id}
              onPress={() => {
                if (!isLoading) {
                  action();
                }
              }}
            >
              {isSelected ? <FilledStarIcon width={width} height={height} /> : <StarIcon width={width} height={height} />}
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

Rating.propTypes = {
  bookId: string,
  rating: number,
  wrapperStyle: any,
  width: number,
  height: number,
};

export default Rating;
