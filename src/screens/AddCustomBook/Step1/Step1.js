import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { bool, string, func, number, arrayOf, shape } from 'prop-types';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { getValidationFailure, validationTypes } from '~utils/validation';
import BooksList from '~screens/Home/BooksList';
import Button from '~UI/Button';
import { Spinner } from '~UI/Spinner';
import Input from '~UI/TextInput';
import { PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { ALL } from '~constants/boardType';
import styles from './styles';

const Step1 = ({
  setBookName,
  bookName,
  onPressNext,
  suggestedBooks,
  loadingDataStatus,
  loadSuggestedBooks,
  allowsNextAction,
  setAvailableStep,
  clearSteps,
  clearSuggestedBooks,
}) => {
  const { t } = useTranslation(['customBook, common, errors']);
  const [bookNameTemp, setBookNameTemp] = useState(bookName.value);
  const [bookNameErrorTemp, setBookNameErrorTemp] = useState(bookName.error);

  const handleAddBook = async () => {
    setBookName('', null);
    const params = { minLength: 3, maxLength: 64 };
    const error = getValidationFailure(
      bookNameTemp,
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    const hasError = error ? t(`errors:${error}`, params) : null;
    setBookNameErrorTemp(hasError);

    if (isEmpty(error) && !isEmpty(bookNameTemp)) {
      clearSteps();
      setAvailableStep(1);
      const error = await loadSuggestedBooks(bookNameTemp);
      setBookNameErrorTemp(error);
      if (!error) {
        setBookName(bookNameTemp, null);
      }
    }
  };

  const handleClear = () => {
    if (loadingDataStatus === PENDING) {
      return false;
    }
    setBookName('', null);
    clearSuggestedBooks();
    clearSteps();
    setAvailableStep(1);
    setBookNameErrorTemp(null);
    setBookNameTemp('');
    return true;
  };

  const handleChangeBookName = (value) => {
    setBookNameErrorTemp(null);
    setBookNameTemp(value);
  };

  const shouldDisplayError = !!bookNameErrorTemp;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Input
          placeholder={t('customBook:enterBookName')}
          onChangeText={handleChangeBookName}
          value={bookNameTemp}
          wrapperClassName={[styles.bookNameInputWrapper, shouldDisplayError && styles.bookNameInputWithErrorWrapper]}
          errorWrapperClassName={styles.errorWrapperClassName}
          shouldDisplayClearButton={!!bookNameTemp && loadingDataStatus !== PENDING}
          error={bookNameErrorTemp}
          disabled={loadingDataStatus === PENDING}
          validateable={shouldDisplayError}
          onClear={handleClear}
        />
        <Button
          disabled={!bookNameTemp || !!bookNameErrorTemp || loadingDataStatus === PENDING || (bookNameTemp && bookNameTemp === bookName.value)}
          style={styles.addButton}
          onPress={handleAddBook}
          title={t('common:add')}
        />
      </View>
      <View style={styles.bookListWrapper}>
        {bookNameTemp === bookName.value && bookNameTemp && !bookNameErrorTemp && loadingDataStatus === SUCCEEDED && suggestedBooks.length === 0 && (
          <Text style={[styles.suggestionLabel, styles.successLabel]}>{t('customBook:pressNextToAddTheBook')}</Text>
        )}
        {loadingDataStatus === PENDING && <Spinner />}
        {loadingDataStatus !== PENDING && suggestedBooks.length > 0 && (
          <>
            {bookNameTemp === bookName.value && !bookNameErrorTemp && (
              <Text style={styles.suggestionLabel}>{t('customBook:weHaveTheSimilarBooks')}</Text>
            )}
            <BooksList searchText={bookName.value} data={suggestedBooks} loadingDataStatus={loadingDataStatus} extraData={suggestedBooks} />
          </>
        )}
      </View>

      <View style={styles.nextButtonWrapper}>
        <Button disabled={!allowsNextAction} style={styles.nextButton} onPress={onPressNext} title={t('common:next')} />
      </View>
    </View>
  );
};

Step1.propTypes = {
  allowsNextAction: bool,
  onPressNext: func.isRequired,
  setBookName: func.isRequired,
  loadSuggestedBooks: func.isRequired,
  setAvailableStep: func.isRequired,
  clearSteps: func.isRequired,
  bookName: shape({
    value: string,
    error: string,
  }),
  clearSuggestedBooks: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
  suggestedBooks: arrayOf(
    shape({
      _id: string,
      title: string,
      categoryPath: string,
      coverPath: string,
      votesCount: number,
      type: string,
    }),
  ).isRequired,
};

export default Step1;
