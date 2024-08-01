/* eslint-disable react/forbid-prop-types */
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { any, number, string } from 'prop-types';
import { FlatList, Animated, Text, TouchableOpacity, Modal, View, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserBook } from '~redux/actions/booksActions';
import { getBoardType } from '~redux/selectors/books';
import { DROPDOWN_ICON } from '~constants/dimensions';
import useGetAnimatedPlaceholderStyle from '~hooks/useGetAnimatedPlaceholderStyle';
import DropdownIcon from '~assets/dropdown.svg';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import colors from '~styles/colors';
import styles from './styles';

const getStatusColor = (bookStatus) =>
  ({
    [PLANNED]: colors.planned,
    [IN_PROGRESS]: colors.in_progress,
    [COMPLETED]: colors.completed,
  }[bookStatus] || colors.neutral_light);

const Dropdown = ({ bookStatus, bookId, wrapperStyle, buttonLabelStyle, dropdownLeftPosition, dropdownHeight }) => {
  const { t } = useTranslation('books');
  const dispatch = useDispatch();
  const { height } = useWindowDimensions();
  const dropdownButton = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const boardType = useSelector(getBoardType);
  const statusColor = getStatusColor(bookStatus);
  const dropdownTop = useRef(0);
  const dropdownBottom = useRef(0);
  const dropdownLeft = useRef(0);
  const animatedStyle = useGetAnimatedPlaceholderStyle(isLoading);

  const actionTypes = useMemo(
    () => [
      { title: t('noStatus'), value: ALL },
      {
        title: t('planned'),
        value: PLANNED,
      },
      { title: t('inProgress'), value: IN_PROGRESS },
      { title: t('completed'), value: COMPLETED },
    ],
    [t],
  );

  const openDropdown = useCallback(() => {
    dropdownButton.current.measure((fx, fy, w, h, px, py) => {
      if (height - py < dropdownHeight + 60) {
        dropdownTop.current = null;
        dropdownBottom.current = height - py;
      } else {
        dropdownBottom.current = null;
        dropdownTop.current = py + h;
      }
      dropdownLeft.current = dropdownLeftPosition || px;
      setVisible(true);
    });
  }, [dropdownHeight, dropdownLeftPosition, height]);

  const toggleDropdown = useCallback(() => (visible ? setVisible(false) : openDropdown()), [openDropdown, visible]);

  const handleUpdateBookStatus = useCallback(
    async (newBookStatus) => {
      setVisible(false);
      if (isLoading || (bookStatus || ALL) === newBookStatus) {
        return;
      }
      const added = new Date().getTime();
      try {
        setIsLoading(true);
        await dispatch(
          updateUserBook({
            book: { bookId, bookStatus },
            added,
            newBookStatus,
            boardType,
          }),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [boardType, bookId, bookStatus, dispatch, isLoading],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleUpdateBookStatus(item.value)}
        style={{
          ...styles.dropdownItemStyle,
          ...(item.value === (bookStatus || ALL) && { backgroundColor: colors.primary_medium }),
        }}
      >
        <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
      </TouchableOpacity>
    ),
    [bookStatus, handleUpdateBookStatus],
  );

  const getKeyExtractor = useCallback((item, index) => index.toString(), []);

  const renderDropdown = () => {
    return (
      <Modal visible={visible} transparent animationType='none'>
        <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)} />
        <View
          style={[
            styles.dropdown,
            {
              ...(dropdownTop.current && { top: dropdownTop.current }),
              ...(dropdownBottom.current && { bottom: dropdownBottom.current }),
              left: dropdownLeft.current,
            },
          ]}
        >
          <FlatList data={actionTypes} renderItem={renderItem} keyExtractor={getKeyExtractor} />
        </View>
      </Modal>
    );
  };

  return (
    <Animated.View style={isLoading ? { opacity: animatedStyle } : {}}>
      <TouchableOpacity
        ref={dropdownButton}
        style={[styles.dropdownButtonStyle, wrapperStyle, { borderColor: statusColor }]}
        disabled={isLoading}
        onPress={toggleDropdown}
      >
        <View style={styles.status}>
          <Text style={[styles.dropdownButtonTxtStyle, buttonLabelStyle, { color: statusColor }]}>{t(bookStatus) || t('noStatus')}</Text>
          <DropdownIcon width={DROPDOWN_ICON.width} height={DROPDOWN_ICON.height} style={{ fill: statusColor }} />
        </View>
        {renderDropdown()}
      </TouchableOpacity>
    </Animated.View>
  );
};

Dropdown.propTypes = {
  bookId: string,
  bookStatus: string,
  wrapperStyle: any,
  buttonLabelStyle: any,
  dropdownLeftPosition: number,
  dropdownHeight: number,
};

export default Dropdown;
