import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { bool, number, func, node, string } from 'prop-types';
import { Animated, Text, View, Pressable } from 'react-native';
import Button from '~UI/Button';
import { SECONDARY } from '~constants/themes';
import { CLOSE_ICON } from '~constants/dimensions';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const SlideMenu = ({ isVisible, onClose, shouldAutoClose, onReset, children, title, titleReset, menuHeight }) => {
  const [shouldDIsplay, setShouldDisplay] = useState(false);
  const [shouldDIsplayOverlay, setShouldDIsplayOverlay] = useState(false);
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
      onClose();
    });
  }, [animatedHeight, menuHeight, onClose]);

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
    if (shouldDIsplay) {
      Animated.spring(animatedHeight, {
        useNativeDriver: true,
        toValue: 0,
        duration,
      }).start();
    }
  }, [shouldDIsplay, animatedHeight]);

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
};

SlideMenu.propTypes = {
  isVisible: bool,
  shouldAutoClose: bool,
  onClose: func.isRequired,
  onReset: func.isRequired,
  children: node.isRequired,
  menuHeight: number,
  title: string,
  titleReset: string,
};

export default SlideMenu;
