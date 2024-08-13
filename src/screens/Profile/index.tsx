import React, { FC } from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { ABOUT_ROUTE } from '~constants/routes';
import { SECONDARY } from '~constants/themes';
import { getUserEmail, getRegistered } from '~redux/selectors/auth';
import { signOut } from '~redux/actions/authActions';
import { showModal } from '~redux/actions/booksActions';
import { LANGUAGE_SETTINGS } from '~constants/modalTypes';
import { useAppDispatch, useAppSelector } from '~hooks';
import Button from '~UI/Button';
import styles from './styles';

type Props = {
  isTheLatestAppVersion?: boolean;
  googlePlayUrl: string;
};

const Profile: FC<Props> = ({ isTheLatestAppVersion, googlePlayUrl }) => {
  const { t, i18n } = useTranslation(['profile', 'common', 'app']);
  const navigation = useNavigation<any>();

  const { language } = i18n;

  const dispatch = useAppDispatch();
  const _signOut = () => dispatch(signOut());
  const _showModal = () => dispatch(showModal(LANGUAGE_SETTINGS));

  const email = useAppSelector(getUserEmail);
  const registered = useAppSelector(getRegistered);

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
          <Button theme={SECONDARY} style={styles.languageButton} titleStyle={styles.titleStyle} title={t(`app:${language}`)} onPress={_showModal} />
        </Text>
      </View>
      <View style={styles.buttonsWrapper}>
        <View style={styles.buttons}>
          <ScrollView>
            {!isTheLatestAppVersion && (
              <View style={styles.marginBottom}>
                <Text style={[styles.updateLabel]}>{t('newVersionAvailable')}</Text>
                <Button onPress={() => Linking.openURL(googlePlayUrl)} title={t('common:update')} />
              </View>
            )}
            <Button theme={SECONDARY} style={styles.marginBottom} onPress={() => navigation.navigate(ABOUT_ROUTE)} title={t('aboutApp')} />
            <Button theme={SECONDARY} onPress={_signOut} title={t('signOut')} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default Profile;
