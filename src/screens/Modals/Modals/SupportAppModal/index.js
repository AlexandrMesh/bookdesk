import React, { useEffect, useState, useCallback } from 'react';
import { Modal, ScrollView, View, Text, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { supportApp } from '~redux/actions/appActions';
import { getSupportAppViewedAt, getRegistered } from '~redux/selectors/auth';
import differenceInDays from '~utils/differenceInDays';
import Button from '~UI/Button';
import styles from './styles';

const SupportAppModal = () => {
  const { t } = useTranslation(['app', 'common']);
  const viewedAt = useSelector(getSupportAppViewedAt);
  const registered = useSelector(getRegistered);
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);

  const handlePressSupportButton = async () => {
    const googlePlayUrl = await AsyncStorage.getItem('googlePlayUrl');
    Linking.openURL(googlePlayUrl);
    setIsVisible(false);
    dispatch(supportApp(true));
  };

  const handlePressAlreadySupportButton = () => {
    setIsVisible(false);
    dispatch(supportApp(false));
  };

  const getShouldDisplayModal = useCallback(async () => {
    const enabledSupportAppModal = await AsyncStorage.getItem('enabledSupportAppModal');
    const daysRegisteredUserFromNowToDisplayModal = await AsyncStorage.getItem('daysRegisteredUserFromNowToDisplaySupportAppModal');
    const daysViewedSupportModalFromNowToDisplayModal = await AsyncStorage.getItem('daysViewedSupportModalFromNowToDisplaySupportAppModal');
    setIsVisible(
      enabledSupportAppModal &&
        (!viewedAt || differenceInDays(viewedAt) > Number(daysViewedSupportModalFromNowToDisplayModal)) &&
        differenceInDays(registered) > Number(daysRegisteredUserFromNowToDisplayModal),
    );
  }, [viewedAt, registered]);

  useEffect(() => {
    getShouldDisplayModal();
  }, [getShouldDisplayModal]);

  return (
    <Modal animationType='slide' transparent visible={isVisible}>
      <View style={styles.overlay} />
      <View style={styles.wrapper}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.modal}>
          <Text style={styles.title}>{t('supportAppTitle')}</Text>
          <Text style={styles.description}>{t('supportAppDescription.line1')}</Text>
          <Text style={styles.description}>{t('supportAppDescription.line2')}</Text>
          <Text style={styles.description}>{t('supportAppDescription.line3')}</Text>

          <View style={styles.footer}>
            <Button style={styles.supportButton} titleStyle={styles.supportButtonTitle} title={t('supportApp')} onPress={handlePressSupportButton} />
            <TouchableOpacity onPress={handlePressAlreadySupportButton}>
              <Text style={styles.alreadySupportedLink}>{t('alreadySupported')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default SupportAppModal;
