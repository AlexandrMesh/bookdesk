import React from 'react';
import { string, number, func, bool } from 'prop-types';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Stepper from '~UI/Stepper';
import Button from '~UI/Button';
import { Spinner } from '~UI/Spinner';
import { SECONDARY } from '~constants/themes';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import { PLANNED_BOOKS_ROUTE, IN_PROGRESS_BOOKS_ROUTE, COMPLETED_BOOKS_ROUTE, ALL_BOOKS_ROUTE } from '~constants/routes';
import { PENDING } from '~constants/loadingStatuses';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import styles from './styles';

const getBoardRoute = (bookStatus) =>
  ({
    [PLANNED]: PLANNED_BOOKS_ROUTE,
    [IN_PROGRESS]: IN_PROGRESS_BOOKS_ROUTE,
    [COMPLETED]: COMPLETED_BOOKS_ROUTE,
  }[bookStatus] || ALL_BOOKS_ROUTE);

const AddCustomBook = ({
  availableStep,
  currentStep,
  setCurrentStep,
  addedCustomBook,
  savingCustomBookStatus,
  clearAddCustomBookState,
  customBookStatus,
}) => {
  const { t } = useTranslation('customBook');

  const navigation = useNavigation();

  const steps = [
    {
      step: 1,
      component: <Step1 />,
    },
    {
      step: 2,
      component: <Step2 />,
    },
    {
      step: 3,
      component: <Step3 />,
    },
  ];

  const handleBackToBoard = () => {
    clearAddCustomBookState();
    navigation.navigate(getBoardRoute(customBookStatus));
  };

  return addedCustomBook ? (
    <View style={styles.successContainer}>
      <View style={styles.successHeader}>
        <Text style={styles.successTitle}>{t('congratulations')}</Text>
        <Text style={styles.successSubTitle}>{t('theBookWasAdded')}</Text>
      </View>
      <View style={styles.buttons}>
        <Button style={styles.button} onPress={clearAddCustomBookState} title={t('addOneMoreBook')} />
        <Button theme={SECONDARY} style={styles.button} onPress={handleBackToBoard} title={t('backToTheDesk')} />
      </View>
    </View>
  ) : (
    <View style={styles.container}>
      {savingCustomBookStatus === PENDING ? (
        <Spinner />
      ) : (
        <Stepper steps={steps} lastAvailableStep={availableStep} currentStep={currentStep} onStepPress={setCurrentStep} />
      )}
    </View>
  );
};

AddCustomBook.propTypes = {
  savingCustomBookStatus: loadingDataStatusShape,
  addedCustomBook: bool,
  availableStep: number,
  currentStep: number,
  customBookStatus: string,
  setCurrentStep: func.isRequired,
  clearAddCustomBookState: func.isRequired,
};

export default AddCustomBook;
