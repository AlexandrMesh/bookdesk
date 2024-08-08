import React from 'react';
import { ScrollView, View, Pressable, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash/uniqueId';
import { SECONDARY } from '~constants/themes';
import { CLOSE_ICON } from '~constants/dimensions';
import { ALL } from '~constants/boardType';
import { getSelectedCategoryLabel, getStatus, getPages, getAuthorsList, getAnnotation, deriveIsValidFullForm } from '~redux/selectors/customBook';
import { showModal } from '~redux/actions/booksActions';
import {
  setPages,
  addAuthor,
  removeAuthor,
  updateAuthor,
  setAnnotation,
  setAnnotationError,
  setCurrentStep,
  addCustomBook,
} from '~redux/actions/customBookActions';
import { CUSTOM_BOOK_CATEGORY, CUSTOM_BOOK_STATUS } from '~constants/modalTypes';
import { useAppDispatch, useAppSelector } from '~hooks';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Input from '~UI/TextInput';
import Button from '~UI/Button';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const Step3 = () => {
  const { t } = useTranslation(['customBook, common, books, categories, errors']);
  const dispatch = useAppDispatch();
  const onPressBack = () => dispatch(setCurrentStep(2));
  const showCategoryChooser = () => dispatch(showModal(CUSTOM_BOOK_CATEGORY));
  const showCustomBookStatusChooser = () => dispatch(showModal(CUSTOM_BOOK_STATUS));
  const _setPages = (pages: string | null, error?: string | null) => dispatch(setPages({ pages, error }));
  const _addAuthor = (id: string) => dispatch(addAuthor(id));
  const _removeAuthor = (id: string) => dispatch(removeAuthor(id));
  const _updateAuthor = (id: string, name: string, error?: string | null) => dispatch(updateAuthor({ id, name, error }));
  const _setAnnotation = (annotation: string, error?: string | null) => dispatch(setAnnotation({ annotation, error }));
  const _setAnnotationError = (error: string | null) => dispatch(setAnnotationError(error));
  const _addCustomBook = () => dispatch(addCustomBook());

  const selectedCategoryLabel = useAppSelector(getSelectedCategoryLabel);
  const status = useAppSelector(getStatus);
  const pages = useAppSelector(getPages);
  const authorsList = useAppSelector(getAuthorsList);
  const annotation = useAppSelector(getAnnotation);
  const isValidForm = useAppSelector(deriveIsValidFullForm);

  const handleAddAuthor = () => {
    _addAuthor(uniqueId());
  };

  const handleAuthorChange = (value: string, id: string) => {
    const params = {
      minLength: 6,
      maxLength: 64,
    };
    const error = getValidationFailure(
      value,
      [validationTypes.mustContainOnlyLetters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    _updateAuthor(id, value, error ? t(`errors:${error}`, params) : null);
  };

  const handleChangePages = (value: string) => {
    const params = {
      minLength: 2,
      maxLength: 5,
    };
    const error = getValidationFailure(
      value,
      [validationTypes.mustContainOnlyNumbers, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    _setPages(value, error ? t(`errors:${error}`, params) : null);
  };

  const handleChangeAnnotation = (value: string) => {
    _setAnnotation(value, null);
  };

  const validateAnnotation = () => {
    const params = {
      minLength: 100,
      maxLength: 1000,
    };
    const error = getValidationFailure(
      annotation.value,
      [validationTypes.containsSpecialCharacters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    _setAnnotationError(error ? t(`errors:${error}`, params) : null);
    return !error;
  };

  const handleAddBook = () => {
    const isAnnotationValid = validateAnnotation();

    if (isAnnotationValid) {
      _addCustomBook();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.inputWrapper} keyboardShouldPersistTaps='handled'>
        <View style={styles.block}>
          <Text style={styles.subTitle}>
            {t('customBook:category')}
            {t('common:required')}
          </Text>
          <View style={styles.blockWrapper}>
            <Pressable style={[styles.inputBlockWrapper, selectedCategoryLabel ? styles.activeInputWrapper : {}]} onPress={showCategoryChooser}>
              <Text numberOfLines={1} style={[styles.inputLabel, selectedCategoryLabel ? styles.activeInputLabel : {}]}>
                {selectedCategoryLabel ? t(`categories:${selectedCategoryLabel}`) : t(`customBook:noCategory`)}
              </Text>
            </Pressable>
            <Button style={styles.mainButton} onPress={showCategoryChooser} title={t('common:choose')} />
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.subTitle}>{t('customBook:status')}</Text>
          <View style={styles.blockWrapper}>
            <Pressable style={[styles.inputBlockWrapper, status !== ALL && styles.activeInputWrapper]} onPress={showCustomBookStatusChooser}>
              <Text numberOfLines={1} style={[styles.inputLabel, status !== ALL && styles.activeInputLabel]}>
                {status === ALL ? t(`books:noStatus`) : t(`books:${status}`)}
              </Text>
            </Pressable>
            <Button style={styles.mainButton} onPress={showCustomBookStatusChooser} title={t('common:choose')} />
          </View>
        </View>

        <View>
          <Text style={styles.subTitle}>
            {t('customBook:pages')}
            {t('common:required')}
          </Text>
          <Input
            placeholder={t('customBook:enterPagesCount')}
            onChangeText={handleChangePages}
            value={pages.value as string}
            error={pages.error}
            shouldDisplayClearButton={!!pages.value}
            onClear={() => _setPages(null)}
            inputMode='numeric'
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.subTitle}>
            {t('customBook:authorsList')}
            {t('common:required')}
          </Text>
          {authorsList.map(({ id, name, error }) => (
            <View style={styles.authorWrapper} key={id}>
              <Input
                wrapperClassName={styles.authorsNameInputWrapper}
                placeholder={t('customBook:enterAuthorsName')}
                onChangeText={(value) => handleAuthorChange(value, id)}
                value={name as string}
                error={error}
                shouldDisplayClearButton={!!name}
                onClear={() => _updateAuthor(id, '')}
              />
              <Pressable style={styles.removeAuthorButton} onPress={() => _removeAuthor(id)}>
                <CloseIcon width={CLOSE_ICON.width} height={CLOSE_ICON.height} fill={colors.neutral_light} />
              </Pressable>
            </View>
          ))}

          <Button
            disabled={authorsList.length > 2}
            style={[styles.button, styles.addAuthorButton]}
            onPress={handleAddAuthor}
            title={t('customBook:addAuthor')}
          />
        </View>

        <View style={styles.block}>
          <View style={styles.annotationLabelWrapper}>
            <Text style={styles.subTitle}>
              {t('customBook:annotation')}
              {t('common:required')}
            </Text>
            {annotation.value && (
              <Text style={styles.subTitle}>{t('common:charactersCount', { count: annotation.value.length, maxCount: 100 })}</Text>
            )}
          </View>

          <Input
            placeholder={t('customBook:enterAnnotation')}
            wrapperClassName={styles.annotationWrapperClassName}
            className={styles.annotationInput}
            onChangeText={handleChangeAnnotation}
            value={annotation.value as string}
            error={annotation.error}
            shouldDisplayClearButton={!!annotation.value}
            onClear={() => _setAnnotation('')}
            multiline
            numberOfLines={5}
          />
        </View>
      </ScrollView>

      <View>
        <Text style={styles.tip}>{t('common:requiredFields')}</Text>
        <View style={styles.footerButtonsWrapper}>
          <Button theme={SECONDARY} style={styles.footerButton} onPress={onPressBack} title={t('common:back')} />
          <Button disabled={!isValidForm} style={styles.footerButton} onPress={handleAddBook} title={t('common:add')} />
        </View>
      </View>
    </View>
  );
};

export default Step3;
