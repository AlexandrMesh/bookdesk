import React, { useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { bool, string, func, number, arrayOf, shape } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import loadingDataStatusShape from '~shapes/loadingDataStatus';
import useGetImgUrl from '~hooks/useGetImgUrl';
import { Spinner } from '~UI/Spinner';
import { DEFAULT_COVER } from '~constants/customBooks';
import RadioButton from '~UI/RadioButton';
import { PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { SECONDARY } from '~constants/themes';
import Button from '~UI/Button';
import styles from './styles';

const Step2 = ({
  shouldAddCover,
  setShouldAddCover,
  allowsNextActionInTheStep2,
  loadSuggestedCovers,
  bookName,
  loadingDataStatus,
  suggestedCoversData,
  selectCover,
  selectedCover,
  onPressBack,
  onPressNext,
}) => {
  const { t } = useTranslation(['customBook, common']);
  const imgUrl = useGetImgUrl();

  const handlePressOnWithoutCover = () => {
    setShouldAddCover(false);
  };

  const handlePressOnWithCover = () => setShouldAddCover(true);

  const suggestedCoversExist = suggestedCoversData.length > 0;

  const getKeyExtractor = useCallback(({ coverPath }) => coverPath, []);

  const renderItem = useCallback(
    ({ item, extraData }) => {
      const selected = extraData === item.coverPath;
      return (
        <Pressable style={[styles.coverWrapper, selected && styles.selectedCover]} onPress={() => selectCover(item.coverPath)}>
          <RadioButton style={styles.selectedCoverRadioButton} isSelected={selected} />
          <FastImage
            style={styles.cover}
            source={{
              uri: item.coverPath,
            }}
          />
        </Pressable>
      );
    },
    [selectCover],
  );

  useEffect(() => {
    if (bookName.value && shouldAddCover && !suggestedCoversExist) {
      loadSuggestedCovers();
    }
  }, [bookName.value, shouldAddCover, loadSuggestedCovers, suggestedCoversExist]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {shouldAddCover === undefined && <Text style={styles.suggestionLabel}>{t('customBook:chooseTheOptionForBookCover')}</Text>}

        <View style={styles.buttonsWrapper}>
          <Button
            disabled={shouldAddCover === false}
            theme={SECONDARY}
            style={styles.button}
            onPress={handlePressOnWithoutCover}
            title={t('customBook:withoutCover')}
          />
          <Button disabled={shouldAddCover} style={styles.button} onPress={handlePressOnWithCover} title={t('customBook:findCover')} />
        </View>

        {shouldAddCover && loadingDataStatus === PENDING ? (
          <View style={styles.contentWrapper}>
            <Spinner />
          </View>
        ) : (
          <ScrollView style={styles.contentWrapper} keyboardShouldPersistTaps='handled'>
            {shouldAddCover === false && (
              <View style={styles.defaultCoverWrapper}>
                <Text style={styles.suggestionLabel}>{t('customBook:theExampleOfTheBookCover')}</Text>
                <View>
                  <View style={[styles.defaultCover, styles.selectedCover]}>
                    <RadioButton style={styles.selectedCoverRadioButton} isSelected />
                    {imgUrl && (
                      <FastImage
                        style={styles.cover}
                        source={{
                          uri: `${imgUrl}/${DEFAULT_COVER}.webp`,
                        }}
                      />
                    )}
                  </View>
                </View>
              </View>
            )}
            {shouldAddCover && loadingDataStatus === SUCCEEDED && suggestedCoversData.length > 0 && (
              <View style={styles.suggestedCovers}>
                <Text style={styles.suggestionLabel}>{t('customBook:chooseTheBookCover')}</Text>
                <FlashList
                  data={suggestedCoversData}
                  estimatedItemSize={50}
                  estimatedListSize={{ height: 260, width: 500 }}
                  horizontal
                  extraData={selectedCover}
                  renderItem={renderItem}
                  keyExtractor={getKeyExtractor}
                />
              </View>
            )}
          </ScrollView>
        )}
      </View>

      <View style={styles.footerButtonsWrapper}>
        <Button theme={SECONDARY} style={styles.footerButton} onPress={onPressBack} title={t('common:back')} />
        <Button disabled={!allowsNextActionInTheStep2} style={styles.footerButton} onPress={onPressNext} title={t('common:next')} />
      </View>
    </View>
  );
};

Step2.propTypes = {
  loadingDataStatus: loadingDataStatusShape,
  suggestedCoversData: arrayOf(
    shape({
      fullCoverPath: string,
      preview: shape({
        path: string,
        width: number,
        height: number,
      }),
    }),
  ),
  bookName: shape({
    value: string,
    error: string,
  }),
  shouldAddCover: bool,
  allowsNextActionInTheStep2: bool,
  setShouldAddCover: func.isRequired,
  loadSuggestedCovers: func.isRequired,
  onPressNext: func.isRequired,
  selectCover: func.isRequired,
  onPressBack: func.isRequired,
  selectedCover: string,
};

export default Step2;
