import React, { useCallback, useMemo, useState, useEffect, useLayoutEffect } from 'react';
import { bool, number, func, node, string } from 'prop-types';
import { Animated, Text, View, Pressable, Dimensions } from 'react-native';
import { useKeyboard, useBackHandler } from '@react-native-community/hooks';
import Button from '~UI/Button';
import { SECONDARY } from '~constants/themes';
import { CLOSE_ICON } from '~constants/dimensions';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const SlideMenu = ({ isVisible, onClose, shouldAutoClose, onReset, children, title, titleReset, menuHeight, shouldRecalculateDimensions }) => {
  const keyboard = useKeyboard();
  const windowHeight = Dimensions.get('window').height - 40;
  const [calculatedMenuHeight, setCalculatedMenuHeight] = useState(menuHeight);
  const [shouldDIsplay, setShouldDisplay] = useState(false);
  const [shouldDIsplayOverlay, setShouldDIsplayOverlay] = useState(false);
  const animatedHeight = useMemo(() => new Animated.Value(menuHeight), [menuHeight]);
  const duration = 120;

  const hideModal = useCallback(() => {
    setShouldDIsplayOverlay(false);
    Animated.spring(animatedHeight, {
      useNativeDriver: true,
      toValue: calculatedMenuHeight,
      duration,
      restSpeedThreshold: 100,
      restDisplacementThreshold: 40,
    }).start(() => {
      onClose();
    });
  }, [animatedHeight, calculatedMenuHeight, onClose]);

  useBackHandler(() => {
    if (isVisible) {
      hideModal();
      return true;
    }
    return false;
  });

  useLayoutEffect(() => {
    if (keyboard.keyboardShown) {
      setCalculatedMenuHeight(windowHeight - keyboard.keyboardHeight < menuHeight ? windowHeight - keyboard.keyboardHeight : menuHeight);
    } else {
      setCalculatedMenuHeight(windowHeight < menuHeight ? windowHeight : menuHeight);
    }
  }, [menuHeight, windowHeight, keyboard.keyboardHeight, keyboard.keyboardShown]);

  useEffect(() => {
    if (isVisible) {
      setShouldDisplay(true);
      setShouldDIsplayOverlay(true);
    } else {
      setShouldDisplay(false);
    }
  }, [isVisible, setShouldDisplay]);

  useEffect(() => {
    if (shouldAutoClose) {
      hideModal();
    }
  }, [shouldAutoClose, hideModal]);

  useEffect(() => {
    if (shouldDIsplay && !shouldRecalculateDimensions) {
      Animated.spring(animatedHeight, {
        useNativeDriver: true,
        toValue: 0,
        duration,
      }).start();
    }
  }, [shouldDIsplay, animatedHeight, shouldRecalculateDimensions]);

  useEffect(() => {
    if (shouldDIsplay && shouldRecalculateDimensions) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldDIsplay, animatedHeight, shouldRecalculateDimensions]);

  const shouldShowModal = shouldDIsplay;

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
              height: calculatedMenuHeight,
              transform: [{ translateY: animatedHeight }],
            },
            styles.animatedWrapper,
          ]}
        >
          <View style={styles.wrapper}>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title} numberOfLines={1}>
                    {title}
                  </Text>
                  {titleReset ? (
                    <Button style={styles.resetButton} titleStyle={styles.titleStyle} theme={SECONDARY} title={titleReset} onPress={onReset} />
                  ) : null}
                </View>
                <Pressable onPress={hideModal}>
                  <View style={styles.closeIconWrapper}>
                    <CloseIcon width={CLOSE_ICON.width} height={CLOSE_ICON.height} fill={colors.neutral_medium} />
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
  menuHeight: 336,
  onReset: () => undefined,
};

SlideMenu.propTypes = {
  shouldRecalculateDimensions: bool,
  isVisible: bool,
  shouldAutoClose: bool,
  onClose: func.isRequired,
  onReset: func,
  children: node.isRequired,
  menuHeight: number,
  title: string,
  titleReset: string,
};

export default SlideMenu;
