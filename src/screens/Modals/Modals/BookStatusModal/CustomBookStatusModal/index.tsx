import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import Button from '~UI/Button';
import SlideMenu from '~UI/SlideMenu';
import { ALL, PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { useAppDispatch, useAppSelector } from '~hooks';
import { getActiveModal } from '~redux/selectors/books';
import { getStatus } from '~redux/selectors/customBook';
import { hideModal } from '~redux/actions/booksActions';
import { setStatus } from '~redux/actions/customBookActions';
import { CUSTOM_BOOK_STATUS } from '~constants/modalTypes';
import { BookStatus } from '~types/books';
import BookStatusItem from '../BookStatusItem';
import styles from './styles';

const CustomBookStatusModal = () => {
  const { t } = useTranslation(['customBook', 'books', 'common']);
  const dispatch = useAppDispatch();
  const _setStatus = (status: BookStatus) => dispatch(setStatus(status));
  const _hideModal = () => dispatch(hideModal());

  const isVisible = useAppSelector(getActiveModal) === CUSTOM_BOOK_STATUS;
  const status = useAppSelector(getStatus);

  const [newBookStatus, setNewBookStatus] = useState(status);
  const [shouldAutoClose, setShouldAutoClose] = useState(false);

  const actionTypes = useMemo(
    () => [
      { title: t('books:noStatus'), isSelected: newBookStatus === ALL, action: () => setNewBookStatus(ALL) },
      { title: t('books:planned'), isSelected: newBookStatus === PLANNED, action: () => setNewBookStatus(PLANNED) },
      { title: t('books:inProgress'), isSelected: newBookStatus === IN_PROGRESS, action: () => setNewBookStatus(IN_PROGRESS) },
      { title: t('books:completed'), isSelected: newBookStatus === COMPLETED, action: () => setNewBookStatus(COMPLETED) },
    ],
    [newBookStatus, t],
  );

  useEffect(() => {
    setNewBookStatus(status);
    if (!isVisible) {
      setNewBookStatus(status);
    }
  }, [status, isVisible]);

  const handleSubmit = () => {
    _setStatus(newBookStatus);
    setShouldAutoClose(true);
  };

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  const handleClose = () => {
    _hideModal();
  };

  const renderItem = useCallback(
    (item: { item: { title: string; isSelected: boolean; action: () => void } }) => (
      <BookStatusItem title={item.item.title} isSelected={item.item.isSelected} action={item.item.action} />
    ),
    [],
  );

  const getKeyExtractor = useCallback(({ title }: { title: string }) => title, []);

  return (
    <SlideMenu isVisible={isVisible} title={t('status')} onClose={handleClose} shouldAutoClose={shouldAutoClose} onReset={() => undefined}>
      <FlashList data={actionTypes} estimatedItemSize={40} renderItem={renderItem} keyExtractor={getKeyExtractor} />
      <View style={styles.submitButtonWrapper}>
        <Button style={styles.submitButton} title={t('common:save')} onPress={handleSubmit} />
      </View>
    </SlideMenu>
  );
};

export default CustomBookStatusModal;
