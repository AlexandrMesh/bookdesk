import React from 'react';
import { Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { showModal } from '~redux/actions/booksActions';
import { getGoalNumberOfPages } from '~redux/selectors/goals';
import { EDIT_GOAL } from '~constants/modalTypes';
import colors from '~styles/colors';
import EditIcon from '~assets/edit.svg';
import styles from './styles';

const EditComponent = () => {
  const hasGoal = useSelector(getGoalNumberOfPages);
  const dispatch = useDispatch();

  const handleShowEditModal = () => {
    if (hasGoal) {
      dispatch(showModal(EDIT_GOAL));
    }
  };

  return (
    <Pressable style={styles.wrapper} onPress={handleShowEditModal}>
      <EditIcon width={32} height={32} stroke={colors.neutral_medium} />
    </Pressable>
  );
};

export default EditComponent;
