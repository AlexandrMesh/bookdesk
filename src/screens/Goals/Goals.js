import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Button from '~UI/Button';
import { ADD_GOAL } from '~constants/routes';
import styles from './styles';

const Goals = () => {
  const { t } = useTranslation('goals');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.text}>
            Хотите развить в себе привычку читать каждый день? Добавьте себе цель, а приложение поможет Вам следить за достижением результатов.
          </Text>
          <View style={styles.buttons}>
            <Button style={styles.button} onPress={() => navigation.navigate(ADD_GOAL)} title={t('addGoal')} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default Goals;
