import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import styles from './styles';

const Goals = () => {
  const { t } = useTranslation(['goals', 'errors']);
  const [pages, setPages] = useState(null);
  const [errorForPage, setErrorForPages] = useState('');

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
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Сколько страниц хотите читать каждый день?</Text>
        <Input
          wrapperClassName={styles.inputWrapper}
          placeholder={t('enterPagesCount')}
          error={errorForPage}
          onChangeText={handleChangePages}
          inputMode='numeric'
          value={pages}
        />
        <View style={styles.buttons}>
          <Button style={styles.button} onPress={submitForm} title={t('addGoal')} />
        </View>
      </View>
    </View>
  );
};

export default Goals;
