import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { bool, number, func, node, string } from 'prop-types';
import { Animated, Text, View, Pressable } from 'react-native';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const SlideMenu = ({ isVisible, onClose, onReset, children, title, titleReset, menuHeight }) => {
  const [shouldDIsplay, setShouldDisplay] = useState(false);
  const [shouldDIsplayAfterUpdatingBook, setShouldDIsplayAfterUpdatingBook] = useState(false);
  const [shouldDIsplayOverlay, setShouldDIsplayOverlay] = useState(true);
  const animatedHeight = useMemo(() => new Animated.Value(menuHeight), [menuHeight]);
  const duration = 120;

  const hideModal = useCallback(() => {
    setShouldDIsplayOverlay(false);
    Animated.spring(animatedHeight, {
      useNativeDriver: true,
      toValue: menuHeight,
      duration,
      restSpeedThreshold: 100,
      restDisplacementThreshold: 40,
    }).start(() => {
      setShouldDisplay(false);
      setShouldDIsplayAfterUpdatingBook(false);
      setShouldDIsplayOverlay(true);
      onClose();
    });
  }, [setShouldDIsplayOverlay, animatedHeight, menuHeight, onClose]);

  useEffect(() => {
    if (isVisible) {
      setShouldDisplay(true);
    } else {
      setShouldDIsplayAfterUpdatingBook(true);
      setShouldDisplay(false);
    }
  }, [isVisible, setShouldDisplay]);

  useEffect(() => {
    if (!shouldDIsplay && !isVisible) {
      hideModal();
    }
  }, [shouldDIsplay, isVisible, hideModal]);

  useEffect(() => {
    if (shouldDIsplay) {
      Animated.spring(animatedHeight, {
        useNativeDriver: true,
        toValue: 0,
        duration,
      }).start();
    }
  }, [shouldDIsplay, animatedHeight]);

  const shouldShowModal = shouldDIsplay || shouldDIsplayAfterUpdatingBook;

  return (
    shouldShowModal && (
      <View style={styles.topWrapper}>
        {shouldDIsplayOverlay && (
          <Animated.View
            style={[
              {
                opacity: animatedHeight.interpolate({
                  inputRange: [100, 200],
                  outputRange: [0.5, 0],
                  extrapolate: 'clamp',
                }),
              },
              styles.overlay,
            ]}
          >
            <Pressable style={styles.tappableOverlay} onPress={hideModal} />
          </Animated.View>
        )}
        <Animated.View
          style={[
            {
              height: menuHeight,
              transform: [{ translateY: animatedHeight }],
            },
            styles.animatedWrapper,
          ]}
        >
          <View style={styles.wrapper}>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title}>{title}</Text>
                  {titleReset ? (
                    <Pressable onPress={onReset} style={styles.titleResetWrapper}>
                      <Text style={styles.titleReset}>{titleReset}</Text>
                    </Pressable>
                  ) : null}
                </View>
                <Pressable onPress={hideModal}>
                  <View style={styles.closeIconWrapper}>
                    <CloseIcon width='16' height='16' fill={colors.neutral_medium} />
                  </View>
                </Pressable>
              </View>
              {children}
            </View>
          </View>
        </Animated.View>
      </View>
    )
  );
};

SlideMenu.defaultProps = {
  menuHeight: 330,
};

SlideMenu.propTypes = {
  isVisible: bool,
  onClose: func.isRequired,
  onReset: func.isRequired,
  children: node.isRequired,
  menuHeight: number,
  title: string,
  titleReset: string,
};

export default SlideMenu;
