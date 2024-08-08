import React, { useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import Button from '~UI/Button';
import { IDLE, PENDING } from '~constants/loadingStatuses';
import { Spinner } from '~UI/Spinner';
import { getAppName, getAppDescription, getAppEmail, getLoadingDataStatus } from '~redux/selectors/app';
import { loadAppInfo, clearAppInfo } from '~redux/actions/appActions';
import { SECONDARY } from '~constants/themes';
import { useAppDispatch, useAppSelector } from '~hooks';
import styles from './styles';

const About = () => {
  const { t } = useTranslation('app');

  const dispatch = useAppDispatch();
  const _loadAppInfo = useCallback(() => dispatch(loadAppInfo()), [dispatch]);
  const _clearAppInfo = useCallback(() => dispatch(clearAppInfo()), [dispatch]);

  const name = useAppSelector(getAppName);
  const description = useAppSelector(getAppDescription);
  const email = useAppSelector(getAppEmail);
  const loadingDataStatus = useAppSelector(getLoadingDataStatus);

  useEffect(() => {
    _loadAppInfo();
    return () => {
      _clearAppInfo();
    };
  }, [_loadAppInfo, _clearAppInfo]);

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

export default About;
