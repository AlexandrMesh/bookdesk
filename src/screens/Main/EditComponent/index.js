import React from 'react';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';
import { showModal } from '~redux/actions/booksActions';
import { EDIT_GOAL } from '~constants/modalTypes';
import colors from '~styles/colors';
import EditIcon from '~assets/edit.svg';
import styles from './styles';

const EditComponent = () => {
  const dispatch = useDispatch();

  return (
    <Pressable style={styles.wrapper} onPress={() => dispatch(showModal(EDIT_GOAL))}>
      <EditIcon width={32} height={32} stroke={colors.neutral_medium} />
    </Pressable>
  );
};

export default EditComponent;
