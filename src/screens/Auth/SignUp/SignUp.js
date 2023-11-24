import React, { useEffect, useState, useCallback } from 'react';
import { func, string, shape } from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { isEmpty } from 'ramda';
import { getValidationFailure, validationTypes } from '~utils/validation';
import { SIGN_IN_ROUTE } from '~constants/routes';
import Button from '~UI/Button';
import Logo from '~screens/Auth/Logo';
import Input from '~UI/TextInput';
import { Spinner, Size } from '~UI/Spinner';
import { SECONDARY } from '~constants/themes';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import styles from './styles';

const SignUp = ({ signUp, loadingDataStatus, errors, setSignUpError, navigation, clearErrors }) => {
  const { t } = useTranslation(['auth', 'errors']);
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const pendingSignUp = loadingDataStatus === PENDING;

  const isValidForm = () => {
    const emailError = getValidationFailure(email, [validationTypes.hasNoValue, validationTypes.isNotValidEmailPattern]);
    const passwordError = getValidationFailure(password, [validationTypes.hasNoValue, validationTypes.isTooShort, validationTypes.isTooLong]);
    setSignUpError('email', emailError);
    setSignUpError('password', passwordError ? t(`errors:${passwordError}`, { minLength: 6, maxLength: 64 }) : null);
    return !(emailError || passwordError);
  };

  const handleSetEmail = (email) => {
    !isEmpty(errors.email) && setSignUpError('email', '');
    setEmail(email);
  };

  const handleSetPassword = (password) => {
    !isEmpty(errors.password) && setSignUpError('password', '');
    setPassword(password);
  };

  const clearForm = useCallback(() => {
    setEmail('');
    setPassword('');
  }, []);

  const handleSubmitSignIn = () => {
    if (isValidForm()) {
      signUp({ email, password });
    }
  };

  const handleNavigateToSignIn = () => {
    if (!pendingSignUp) {
      navigation.navigate(SIGN_IN_ROUTE);
    }
  };

  useEffect(() => {
    if (!isFocused) {
      clearForm();
      clearErrors();
    }
  }, [isFocused, clearForm, clearErrors]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <ScrollView keyboardShouldPersistTaps='handled'>
          <Logo />
          <View style={styles.formWrapper}>
            <Input
              wrapperClassName={styles.marginBottom}
              error={errors.email && t(`errors:${errors.email}`)}
              placeholder={t('email')}
              onChangeText={handleSetEmail}
              value={email}
              disabled={pendingSignUp}
              inputMode='email'
            />
            <Input
              wrapperClassName={styles.marginBottom}
              error={errors.password}
              placeholder={t('password')}
              onChangeText={handleSetPassword}
              value={password}
              secureTextEntry
              disabled={pendingSignUp}
            />
            <Button
              icon={pendingSignUp && <Spinner size={Size.SMALL} />}
              onPress={handleSubmitSignIn}
              title={t('signUp')}
              disabled={pendingSignUp || isEmpty(email) || isEmpty(password)}
            />

            <View style={styles.existingAccountWrapper}>
              <View style={styles.existingAccountContainer}>
                <Text style={styles.neutralLight}>{t('alreadyHaveAnAccount')} </Text>
                <Button
                  theme={SECONDARY}
                  style={styles.loginButton}
                  titleStyle={styles.loginTitleStyle}
                  onPress={handleNavigateToSignIn}
                  title={t('signIn')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

SignUp.propTypes = {
  signUp: func.isRequired,
  clearErrors: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
  errors: shape({
    email: string,
    password: string,
  }).isRequired,
  setSignUpError: func.isRequired,
};

export default SignUp;
