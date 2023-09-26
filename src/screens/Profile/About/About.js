import React, { useEffect } from 'react';
import { string, func } from 'prop-types';
import { View, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from '~UI/Button';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { Spinner } from '~UI/Spinner';
import { SECONDARY } from '~constants/themes';
import styles from './styles';

const About = ({ loadAppInfo, clearAppInfo, name, version, description, email, loadingDataStatus }) => {
  const { t } = useTranslation('app');

  useEffect(() => {
    loadAppInfo();
    return () => clearAppInfo();
  }, [loadAppInfo, clearAppInfo]);

  return (
    <View style={styles.container}>
      {loadingDataStatus === PENDING || loadingDataStatus === IDLE ? (
        <Spinner />
      ) : (
        <>
          <Text style={styles.label}>
            {t('name')} <Text style={styles.value}>{name}</Text>
          </Text>
          <Text style={styles.label}>
            {t('version')} <Text style={styles.value}>{version}</Text>
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
          <Text style={styles.label}>
            {t('description')} <Text style={styles.value}>{description}</Text>
          </Text>
        </>
      )}
    </View>
  );
};

About.propTypes = {
  name: string,
  version: string,
  description: string,
  email: string,
  loadAppInfo: func.isRequired,
  clearAppInfo: func.isRequired,
  loadingDataStatus: string,
};

export default About;
