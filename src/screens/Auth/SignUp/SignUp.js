import React, { useEffect, useState } from 'react';
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
import Spinner from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
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
    setSignUpError('password', passwordError);
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

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

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
  }, [isFocused]);

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
              error={errors.password && t(`errors:${errors.password}`)}
              placeholder={t('password')}
              onChangeText={handleSetPassword}
              value={password}
              secureTextEntry
              disabled={pendingSignUp}
            />
            <Button
              icon={pendingSignUp && <Spinner size='small' />}
              onPress={handleSubmitSignIn}
              title={t('signUp')}
              disabled={pendingSignUp || isEmpty(email) || isEmpty(password)}
            />

            <View style={styles.signUpWrapper}>
              <Text style={styles.neutralLight}>
                {t('alreadyHaveAnAccount')}{' '}
                <Text onPress={handleNavigateToSignIn} style={styles.link}>
                  {t('signIn')}
                </Text>
              </Text>
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
  loadingDataStatus: string,
  errors: shape({
    email: string,
    password: string,
  }).isRequired,
  setSignUpError: func.isRequired,
};

export default SignUp;
