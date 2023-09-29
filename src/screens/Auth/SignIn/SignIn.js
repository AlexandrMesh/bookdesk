import React, { useState, useEffect } from 'react';
import { func, string, shape } from 'prop-types';
import { ScrollView, View, Text } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/isEmpty';
import Button from '~UI/Button';
import GoogleIcon from '~assets/google.svg';
import { getValidationFailure, validationTypes } from '~utils/validation';
import { SIGN_UP_ROUTE } from '~constants/routes';
import { SECONDARY } from '~constants/themes';
import Logo from '~screens/Auth/Logo';
import Input from '~UI/TextInput';
import { Spinner, Size } from '~UI/Spinner';
import { PENDING } from '~constants/loadingStatuses';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import styles from './styles';

const SignIn = ({ signIn, clearErrors, loadingDataStatus, errors, setSignInError, navigation }) => {
  const { t } = useTranslation(['auth', 'errors']);
  const isFocused = useIsFocused();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const pendingSignIn = loadingDataStatus === PENDING;

  const isValidForm = () => {
    const emailError = getValidationFailure(email, [validationTypes.hasNoValue, validationTypes.isNotValidEmailPattern]);
    const passwordError = getValidationFailure(password, [validationTypes.hasNoValue, validationTypes.isTooShort, validationTypes.isTooLong]);
    setSignInError('email', emailError);
    setSignInError('password', passwordError);
    return !(emailError || passwordError);
  };

  const handleSetEmail = (email) => {
    !isEmpty(errors.email) && setSignInError('email', '');
    setEmail(email);
  };

  const handleSetPassword = (password) => {
    !isEmpty(errors.password) && setSignInError('password', '');
    setPassword(password);
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSubmitSignIn = () => {
    if (isValidForm()) {
      signIn({ email, password });
    }
  };

  const handleGoogleSignIn = () => signIn({ email, password, isGoogleAccount: true });

  const handleNavigateToSignUp = () => {
    if (!pendingSignIn) {
      navigation.navigate(SIGN_UP_ROUTE);
    }
  };

  useEffect(() => {
    if (!isFocused) {
      clearForm();
      clearErrors();
    }
  }, [isFocused, clearErrors]);

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
              disabled={pendingSignIn}
              inputMode='email'
            />
            <Input
              wrapperClassName={styles.marginBottom}
              error={errors.password && t(`errors:${errors.password}`)}
              placeholder={t('password')}
              onChangeText={handleSetPassword}
              value={password}
              secureTextEntry
              disabled={pendingSignIn}
            />
            <Button
              icon={pendingSignIn && <Spinner size={Size.SMALL} />}
              onPress={handleSubmitSignIn}
              title={t('signIn')}
              disabled={pendingSignIn || isEmpty(email) || isEmpty(password)}
            />

            <View style={styles.orWrapper}>
              <Text style={styles.neutralLight}>{t('or')}</Text>
            </View>

            <Button
              theme={SECONDARY}
              onPress={handleGoogleSignIn}
              icon={<GoogleIcon width='26' height='26' />}
              title={t('googleSignIn')}
              disabled={pendingSignIn}
            />

            <View style={styles.signUpWrapper}>
              <Text style={styles.neutralLight}>
                {t('noAccount')}{' '}
                <Text onPress={handleNavigateToSignUp} style={styles.link}>
                  {t('create')}
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

SignIn.propTypes = {
  signIn: func.isRequired,
  clearErrors: func.isRequired,
  setSignInError: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
  errors: shape({
    email: string,
    password: string,
  }).isRequired,
};

export default SignIn;
