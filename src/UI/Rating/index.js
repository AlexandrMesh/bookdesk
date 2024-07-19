/* eslint-disable react/forbid-prop-types */
import React, { useState, useEffect } from 'react';
import { bool, number, any, func } from 'prop-types';
import { Animated, View, Pressable } from 'react-native';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import FilledStarIcon from '~assets/star-filled.svg';
import StarIcon from '~assets/star.svg';
import styles from './styles';

const Rating = ({ isLoading, width = 32, height = 32, wrapperStyle, onChangeRating = () => undefined, rating = 0 }) => {
  const [internalBookRating, setInternalBookRating] = useState(rating);

  const animatedStyleForRating = useGetAnimatedPlaceholderStyle(isLoading);

  const handleChangeRating = (value) => {
    if (value === internalBookRating) {
      const rating = value - 1;
      setInternalBookRating(value - 1);
      onChangeRating(rating);
    } else {
      setInternalBookRating(value);
      onChangeRating(value);
    }
  };

  const ratingItems = [
    { id: '1', isSelected: internalBookRating >= 1, action: () => handleChangeRating(1) },
    { id: '2', isSelected: internalBookRating >= 2, action: () => handleChangeRating(2) },
    { id: '3', isSelected: internalBookRating >= 3, action: () => handleChangeRating(3) },
    { id: '4', isSelected: internalBookRating >= 4, action: () => handleChangeRating(4) },
    { id: '5', isSelected: internalBookRating >= 5, action: () => handleChangeRating(5) },
  ];

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
  rating: number,
  wrapperStyle: any,
  isLoading: bool,
  width: number,
  height: number,
  onChangeRating: func,
};

export default Rating;
