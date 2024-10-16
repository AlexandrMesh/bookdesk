import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '~hooks';
import { getValidationFailure, validationTypes } from '~utils/validation';
import { GOAL_DETAILS } from '~constants/routes';
import Button from '~UI/Button';
import Input from '~UI/TextInput';
import { Spinner } from '~UI/Spinner';
import { addGoal } from '~redux/actions/goalsActions';
import styles from './styles';

const AddGoal = () => {
  const { t } = useTranslation(['goals', 'errors']);
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [pages, setPages] = useState('');
  const [errorForPage, setErrorForPages] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAddGoal = async () => {
    try {
      setIsLoading(true);
      await dispatch(addGoal(pages));
      navigation.navigate(GOAL_DETAILS);
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
      handleAddGoal();
    }
  };

  const handleChangePages = (value: string) => {
    setErrorForPages('');
    setPages(value);
  };

  const handleClearPages = () => {
    setErrorForPages('');
    setPages('');
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.content}>
          <Spinner />
        </View>
      ) : (
        <View>
          <Text style={styles.text}>{t('howManyPagesDoYouWantReadDescription')}</Text>
          <Input
            wrapperClassName={styles.inputWrapper}
            placeholder={t('enterPagesCount')}
            error={errorForPage}
            onChangeText={handleChangePages}
            shouldDisplayClearButton={!!pages}
            onClear={handleClearPages}
            inputMode='numeric'
            value={pages}
          />
          <View style={styles.buttons}>
            <Button style={styles.button} onPress={submitForm} title={t('addGoal')} />
          </View>
        </View>
      )}
    </View>
  );
};

export default AddGoal;
