import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { bool, string, func, number, arrayOf, shape } from 'prop-types';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import useDebouncedSearch from '~hooks/useDebouncedSearch';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import BooksList from '~screens/Home/BooksList';
import Button from '~UI/Button';
import { Spinner } from '~UI/Spinner';
import Input from '~UI/TextInput';
import { IDLE, PENDING, SUCCEEDED } from '~constants/loadingStatuses';
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
  bookExists,
  setBookExists,
  clearSuggestedBooks,
  isStepCompleted,
  removeCompletedStep,
  setAvailableStep,
}) => {
  const { t } = useTranslation(['customBook, common']);
  const [queryValue, handleChangeQuery, clearValue, isBusy] = useDebouncedSearch(setBookName, bookName, 600);

  useEffect(() => {
    if (!isEmpty(bookName) && !isStepCompleted) {
      loadSuggestedBooks();
    }
  }, [bookName, loadSuggestedBooks, isStepCompleted]);

  const handleClear = () => {
    if (loadingDataStatus === PENDING || isBusy) {
      return false;
    }
    setAvailableStep(1);
    removeCompletedStep();
    setBookName('');
    clearValue();
    setBookExists(false);
    clearSuggestedBooks();
    return true;
  };

  const handleChangeBookName = (value) => {
    setAvailableStep(1);
    removeCompletedStep();
    setBookExists(false);
    handleChangeQuery(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Input
          placeholder={t('customBook:enterBookName')}
          onChangeText={handleChangeBookName}
          value={queryValue}
          shouldDisplayClearButton={!!queryValue && !isBusy && loadingDataStatus !== PENDING && loadingDataStatus !== IDLE}
          error={bookExists ? 'Такая книга уже есть в нашей базе' : ''}
          validateable={bookExists}
          onClear={handleClear}
        />
      </View>
      <View style={styles.bookListWrapper}>
        {loadingDataStatus === SUCCEEDED && suggestedBooks.length === 0 && (
          <Text style={styles.suggestionLabel}>Вы можете добавить такую книгу. Нажмите Далее.</Text>
        )}
        {loadingDataStatus === PENDING && <Spinner />}
        {loadingDataStatus !== PENDING && suggestedBooks.length > 0 && (
          <>
            {!bookExists && (
              <Text style={styles.suggestionLabel}>Мы нашли похожие книги. Жмите Далее если в списке нет книги, которую хотели бы добавить.</Text>
            )}
            <BooksList searchText={bookName} enablePullRefresh={false} boardType={ALL} data={suggestedBooks} loadingDataStatus={loadingDataStatus} />
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
  bookExists: bool,
  isStepCompleted: bool,
  onPressNext: func.isRequired,
  setBookName: func.isRequired,
  setBookExists: func.isRequired,
  clearSuggestedBooks: func.isRequired,
  loadSuggestedBooks: func.isRequired,
  removeCompletedStep: func.isRequired,
  setAvailableStep: func.isRequired,
  bookName: string,
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
