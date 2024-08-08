import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { useAppDispatch, useAppSelector } from '~hooks';
import { getActiveModal } from '~redux/selectors/books';
import { hideModal } from '~redux/actions/booksActions';
import { getGoalNumberOfPages } from '~redux/selectors/goals';
import { updateGoal } from '~redux/actions/goalsActions';
import { EDIT_GOAL } from '~constants/modalTypes';
import { Spinner } from '~UI/Spinner';
import SlideMenu from '~UI/SlideMenu';
import styles from './styles';

const LanguageSettings = () => {
  const { t } = useTranslation(['goals', 'common']);
  const [pages, setPages] = useState<string>('');
  const [errorForPage, setErrorForPages] = useState('');
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const _hideModal = () => dispatch(hideModal());
  const _updateGoal = (numberOfPages: string) => dispatch(updateGoal(numberOfPages));

  const isVisible = useAppSelector(getActiveModal) === EDIT_GOAL;
  const goalNumberOfPages = useAppSelector(getGoalNumberOfPages) || 0;

  const validateForm = () => {
    const params = {
      lessComparedValue: 5,
      moreComparedValue: 1000,
    };
    const error = getValidationFailure(
      pages,
      [validationTypes.mustContainOnlyNumbers, validationTypes.isMoreThan, validationTypes.isLessThan],
      params,
    );
    return error ? t(`errors:${error}`, params) : null;
  };

  const handleUpdateGoal = async () => {
    try {
      setIsLoading(true);
      await _updateGoal(pages);
      setShouldAutoClose(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = () => {
    const error = validateForm();
    if (error) {
      setErrorForPages(error);
    } else {
      handleUpdateGoal();
    }
  };

  const handleChangePages = (value: string) => {
    setErrorForPages('');
    setPages(value);
  };

  const clearPages = () => {
    setErrorForPages('');
    setPages('');
  };

  const handleClearPages = () => {
    clearPages();
  };

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

  useEffect(() => {
    if (!isVisible) {
      clearPages();
    } else {
      setPages(goalNumberOfPages.toString());
    }
  }, [isVisible, setPages, goalNumberOfPages]);

  return isVisible ? (
    <SlideMenu
      isVisible={isVisible}
      menuHeight={270}
      title={t('changeGoal')}
      shouldAutoClose={shouldAutoClose}
      onClose={_hideModal}
      onReset={() => undefined}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <View style={styles.wrapper}>
          <View style={styles.content}>
            <Text style={styles.text}>{t('howManyPagesDoYouWantReadDescription')}</Text>
            <Input
              placeholder={t('enterPagesCount')}
              error={errorForPage}
              onChangeText={handleChangePages}
              shouldDisplayClearButton={!!pages}
              onClear={handleClearPages}
              inputMode='numeric'
              value={pages}
            />
            <View style={styles.submitButtonWrapper}>
              <Button title={t('common:save')} onPress={submitForm} />
            </View>
          </View>
        </View>
      )}
    </SlideMenu>
  ) : null;
};

export default LanguageSettings;
