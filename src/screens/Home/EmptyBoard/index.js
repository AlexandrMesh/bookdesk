import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SEARCH_NAVIGATOR_ROUTE } from '~constants/routes';
import Button from '~UI/Button';
import styles from './styles';

const EmptyBoard = () => {
  const { t } = useTranslation(['books', 'common']);
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.content}>
          <Text style={styles.text}>{t('emptyBoard')}</Text>
          <View style={styles.addButtonWrapper}>
            <Button style={styles.addButton} title={t('addBook')} onPress={() => navigation.navigate(SEARCH_NAVIGATOR_ROUTE)} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmptyBoard;
