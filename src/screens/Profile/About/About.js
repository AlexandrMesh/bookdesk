import React, { useEffect } from 'react';
import { string, func } from 'prop-types';
import { ScrollView, View, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import Button from '~UI/Button';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { Spinner } from '~UI/Spinner';
import { SECONDARY } from '~constants/themes';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import styles from './styles';

const About = ({ loadAppInfo, clearAppInfo, name, description, email, loadingDataStatus }) => {
  const { t } = useTranslation('app');

  useEffect(() => {
    loadAppInfo();
    return () => clearAppInfo();
  }, [loadAppInfo, clearAppInfo]);

  return (
    <View style={styles.container}>
      {loadingDataStatus === PENDING || loadingDataStatus === IDLE ? (
        <View style={styles.spinnerWrapper}>
          <Spinner />
        </View>
      ) : (
        <>
          <Text style={styles.label}>
            {t('name')} <Text style={styles.value}>{name}</Text>
          </Text>
          <Text style={styles.label}>
            {t('version')} <Text style={styles.value}>{DeviceInfo.getVersion()}</Text>
          </Text>
          <Text style={styles.label}>
            {t('feedback')}{' '}
            <Button
              theme={SECONDARY}
              style={styles.supportButton}
              titleStyle={styles.titleStyle}
              title={t('support')}
              onPress={() => Linking.openURL(`mailto:${email}`)}
            />
          </Text>
          <Text style={styles.label}>{t('description')}</Text>
          <ScrollView>
            <Text style={styles.value}>{description}</Text>
          </ScrollView>
        </>
      )}
    </View>
  );
};

About.propTypes = {
  name: string,
  description: string,
  email: string,
  loadAppInfo: func.isRequired,
  clearAppInfo: func.isRequired,
  loadingDataStatus: loadingDataStatusShape,
};

export default About;
