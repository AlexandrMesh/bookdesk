import React from 'react';
import { View, Text } from 'react-native';
import { string, func, number } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ABOUT_ROUTE } from '~constants/routes';
import { SECONDARY } from '~constants/themes';
import Button from '~UI/Button';
import styles from './styles';

const Profile = ({ email, registered, signOut }) => {
  const { t } = useTranslation('profile');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.label}>
          {t('email')} <Text style={styles.value}>{email}</Text>
        </Text>
        <Text style={styles.label}>
          {t('registered')} <Text style={styles.value}>{new Date(registered).toLocaleDateString('ru-RU')}</Text>
        </Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <View style={styles.buttons}>
          <Button theme={SECONDARY} onPress={() => navigation.navigate(ABOUT_ROUTE)} title={t('aboutApp')} />
          <Button theme={SECONDARY} style={styles.marginTop} onPress={signOut} title={t('signOut')} />
        </View>
      </View>
    </View>
  );
};

Profile.propTypes = {
  email: string,
  signOut: func.isRequired,
  registered: number,
};

export default Profile;
