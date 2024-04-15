import React, { useState, useEffect } from 'react';
import { bool, func } from 'prop-types';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { Spinner } from '~UI/Spinner';
import SlideMenu from '~UI/SlideMenu';
import styles from './styles';

const LanguageSettings = ({ isVisible, hideModal }) => {
  const { t } = useTranslation(['goals', 'common']);
  const [pages, setPages] = useState(null);
  const [errorForPage, setErrorForPages] = useState('');
  const [shouldAutoClose, setShouldAutoClose] = useState(false);
  const [isLoading, seIstLoading] = useState(false);

  useEffect(() => {
    if (shouldAutoClose) {
      setShouldAutoClose(false);
    }
  }, [shouldAutoClose]);

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

  const submitForm = () => {
    const error = validateForm();
    if (error) {
      setErrorForPages(error);
    } else {
      console.log('submit');
    }
  };

  const handleChangePages = (value) => {
    setErrorForPages('');
    setPages(value);
  };

  return (
    <SlideMenu
      isVisible={isVisible}
      menuHeight={240}
      title={t('changeGoal')}
      shouldAutoClose={shouldAutoClose}
      onClose={hideModal}
      onReset={() => undefined}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <View style={styles.wrapper}>
          <Input placeholder={t('enterPagesCount')} error={errorForPage} onChangeText={handleChangePages} inputMode='numeric' value={pages} />
          <View style={styles.submitButtonWrapper}>
            <Button title={t('common:save')} onPress={submitForm} />
          </View>
        </View>
      )}
    </SlideMenu>
  );
};

LanguageSettings.propTypes = {
  hideModal: func.isRequired,
  isVisible: bool,
};

export default LanguageSettings;
