import React, { useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import useGetImgUrl from '~hooks/useGetImgUrl';
import { useBackHandler } from '@react-native-community/hooks';
import { useAppDispatch, useAppSelector } from '~hooks';
import {
  getShouldAddCover,
  deriveIsValidStep2,
  getNewCustomBookName,
  getSuggestedCoversLoadingDataStatus,
  getSuggestedCoversData,
  getSelectedCover,
} from '~redux/selectors/customBook';
import { setShouldAddCover, loadSuggestedCovers, selectCover, setCurrentStep, setAvailableStep } from '~redux/actions/customBookActions';
import { Spinner } from '~UI/Spinner';
import { DEFAULT_COVER } from '~constants/customBooks';
import RadioButton from '~UI/RadioButton';
import { PENDING, SUCCEEDED } from '~constants/loadingStatuses';
import { SECONDARY } from '~constants/themes';
import Button from '~UI/Button';
import { ICover } from '~types/customBooks';
import styles from './styles';

const Step2 = () => {
  const { t } = useTranslation(['customBook, common']);

  const dispatch = useAppDispatch();
  const onPressBack = () => dispatch(setCurrentStep(1));
  const onPressNext = () => {
    dispatch(setCurrentStep(3));
    dispatch(setAvailableStep(3));
  };

  const shouldAddCover = useAppSelector(getShouldAddCover);
  const allowsNextActionInTheStep2 = useAppSelector(deriveIsValidStep2);
  const bookName = useAppSelector(getNewCustomBookName);
  const loadingDataStatus = useAppSelector(getSuggestedCoversLoadingDataStatus);
  const suggestedCoversData = useAppSelector(getSuggestedCoversData);
  const selectedCover = useAppSelector(getSelectedCover);

  const imgUrl = useGetImgUrl();

  const handlePressOnWithoutCover = () => {
    dispatch(setShouldAddCover(false));
  };

  const handlePressOnWithCover = () => dispatch(setShouldAddCover(true));

  const suggestedCoversExist = suggestedCoversData.length > 0;

  const getKeyExtractor = useCallback(({ coverPath }: { coverPath: string }) => coverPath, []);

  const renderItem = useCallback(
    (renderedItem: { item: ICover; extraData?: string }) => {
      const selected = renderedItem.extraData === renderedItem.item.coverPath;
      return (
        <Pressable style={[styles.coverWrapper, selected && styles.selectedCover]} onPress={() => dispatch(selectCover(renderedItem.item.coverPath))}>
          <RadioButton style={styles.selectedCoverRadioButton as any} isSelected={selected} />
          <FastImage
            style={styles.cover as any}
            source={{
              uri: renderedItem.item.coverPath,
            }}
          />
        </Pressable>
      );
    },
    [dispatch],
  );

  useBackHandler(() => {
    onPressBack();
    return true;
  });

  useEffect(() => {
    if (bookName.value && shouldAddCover && !suggestedCoversExist) {
      dispatch(loadSuggestedCovers());
    }
  }, [dispatch, bookName.value, shouldAddCover, suggestedCoversExist]);

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
                    <RadioButton style={styles.selectedCoverRadioButton as any} isSelected />
                    {imgUrl && (
                      <FastImage
                        style={styles.cover as any}
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

export default Step2;
