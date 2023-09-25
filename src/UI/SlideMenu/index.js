import React from 'react';
import { bool, func, node, string } from 'prop-types';
import { Modal, Text, View, Pressable } from 'react-native';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const SlideMenu = ({ isVisible, onClose, onReset, children, title, titleReset }) => (
  <>
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.overlay} />
    </Modal>
    <Modal animationType='slide' transparent visible={isVisible} onRequestClose={onClose}>
      <View style={styles.wrapper}>
        <Pressable onPress={onClose} style={styles.closeArea} />
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
            <Pressable onPress={onClose}>
              <View style={styles.closeIconWrapper}>
                <CloseIcon width='16' height='16' fill={colors.neutral_medium} />
              </View>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  </>
);

SlideMenu.propTypes = {
  isVisible: bool,
  onClose: func.isRequired,
  onReset: func.isRequired,
  children: node.isRequired,
  title: string,
  titleReset: string,
};

export default SlideMenu;
