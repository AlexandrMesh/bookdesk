import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ADD_CUSTOM_BOOK_NAVIGATOR_ROUTE } from '~constants/routes';
import Button from '~UI/Button';
import styles from './styles';

export type Props = {
  shouldNotDisplayContent?: boolean;
};

const EmptyBoard: FC<Props> = ({ shouldNotDisplayContent = false }) => {
  const { t } = useTranslation(['books', 'common']);
  const navigation = useNavigation<any>();

  return (
    <View style={styles.wrapper}>
      <View>
        <View style={styles.content}>
          {!shouldNotDisplayContent ? (
            <>
              <Text style={styles.text}>{t('emptyBoard')}</Text>
              <View style={styles.addButtonWrapper}>
                <Button style={styles.addButton} title={t('addBook')} onPress={() => navigation.navigate(ADD_CUSTOM_BOOK_NAVIGATOR_ROUTE)} />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default EmptyBoard;
