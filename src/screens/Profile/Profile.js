import React from 'react';
import { View, Text, Linking } from 'react-native';
import { string, func, number, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ABOUT_ROUTE } from '~constants/routes';
import { SECONDARY } from '~constants/themes';
import Button from '~UI/Button';
import styles from './styles';

const Profile = ({ email, registered, signOut, googlePlayUrl, isTheLatestAppVersion, showModal }) => {
  const { t, i18n } = useTranslation(['profile', 'common', 'app']);
  const navigation = useNavigation();

  const { language } = i18n;

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Text style={styles.label}>
          {t('email')} <Text style={styles.value}>{email}</Text>
        </Text>
        <Text style={styles.label}>
          {t('registered')} <Text style={styles.value}>{new Date(Number(registered)).toLocaleDateString(language)}</Text>
        </Text>
        <Text style={[styles.label, styles.mTop]}>
          {t('app:appLanguage')}
          <Button theme={SECONDARY} style={styles.languageButton} titleStyle={styles.titleStyle} title={t(`app:${language}`)} onPress={showModal} />
        </Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <View style={styles.buttons}>
          {!isTheLatestAppVersion && (
            <View style={styles.marginBottom}>
              <Text style={[styles.updateLabel]}>{t('newVersionAvailable')}</Text>
              <Button onPress={() => Linking.openURL(googlePlayUrl)} title={t('common:update')} />
            </View>
          )}
          <Button theme={SECONDARY} style={styles.marginBottom} onPress={() => navigation.navigate(ABOUT_ROUTE)} title={t('aboutApp')} />
          <Button theme={SECONDARY} onPress={signOut} title={t('signOut')} />
        </View>
      </View>
    </View>
  );
};

Profile.propTypes = {
  email: string,
  googlePlayUrl: string,
  signOut: func.isRequired,
  showModal: func.isRequired,
  registered: number,
  isTheLatestAppVersion: bool,
};

export default Profile;
