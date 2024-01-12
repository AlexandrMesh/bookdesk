import React from 'react';
import { ScrollView, View, Pressable, Text } from 'react-native';
import { bool, arrayOf, shape, string, func } from 'prop-types';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash/uniqueId';
import { SECONDARY } from '~constants/themes';
import { CLOSE_ICON } from '~constants/dimensions';
import { ALL } from '~constants/boardType';
import { getValidationFailure, validationTypes } from '~utils/validation';
import Input from '~UI/TextInput';
import Button from '~UI/Button';
import CloseIcon from '~assets/close.svg';
import colors from '~styles/colors';
import styles from './styles';

const Step3 = ({
  selectedCategoryLabel,
  showCategoryChooser,
  showCustomBookStatusChooser,
  status,
  pages,
  setPages,
  addAuthor,
  authorsList,
  removeAuthor,
  updateAuthor,
  annotation,
  setAnnotation,
  setAnnotationError,
  onPressBack,
  isValidForm,
  addCustomBook,
}) => {
  const { t } = useTranslation(['customBook, common, books, categories, errors']);

  const handleAddAuthor = () => {
    addAuthor(uniqueId());
  };

  const handleAuthorChange = (value, id) => {
    const params = {
      minLength: 6,
      maxLength: 64,
    };
    const error = getValidationFailure(
      value,
      [validationTypes.mustContainOnlyLetters, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    updateAuthor(id, value, error ? t(`errors:${error}`, params) : null);
  };

  const handleChangePages = (value) => {
    const params = {
      minLength: 2,
      maxLength: 5,
    };
    const error = getValidationFailure(
      value,
      [validationTypes.mustContainOnlyNumbers, validationTypes.isTooShort, validationTypes.isTooLong],
      params,
    );
    setPages(value, error ? t(`errors:${error}`, params) : null);
  };

  const handleChangeAnnotation = (value) => {
    setAnnotation(value, null);
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
    setAnnotationError(error ? t(`errors:${error}`, params) : null);
    return !error;
  };

  const handleAddBook = () => {
    const isAnnotationValid = validateAnnotation();

    if (isAnnotationValid) {
      addCustomBook();
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
            <Pressable style={[styles.inputBlockWrapper, selectedCategoryLabel && styles.activeInputWrapper]} onPress={showCategoryChooser}>
              <Text numberOfLines={1} style={[styles.inputLabel, selectedCategoryLabel && styles.activeInputLabel]}>
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
            value={pages.value}
            error={pages.error}
            shouldDisplayClearButton={!!pages.value}
            onClear={() => setPages(null)}
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
                value={name}
                error={error}
                shouldDisplayClearButton={!!name}
                onClear={() => updateAuthor(id, '')}
              />
              <Pressable style={styles.removeAuthorButton} onPress={() => removeAuthor(id)}>
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
            value={annotation.value}
            error={annotation.error}
            shouldDisplayClearButton={!!annotation.value}
            onClear={() => setAnnotation('')}
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

Step3.propTypes = {
  selectedCategoryLabel: string,
  showCategoryChooser: func.isRequired,
  showCustomBookStatusChooser: func.isRequired,
  setAnnotationError: func.isRequired,
  onPressBack: func.isRequired,
  addAuthor: func.isRequired,
  setPages: func.isRequired,
  removeAuthor: func.isRequired,
  updateAuthor: func.isRequired,
  setAnnotation: func.isRequired,
  addCustomBook: func.isRequired,
  isValidForm: bool,
  status: string,
  pages: shape({
    value: string,
    error: string,
  }),
  annotation: shape({
    value: string,
    error: string,
  }),
  authorsList: arrayOf(
    shape({
      id: string,
      name: string,
      error: string,
    }),
  ),
};

export default Step3;
