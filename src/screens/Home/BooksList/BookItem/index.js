import React from 'react';
import { shape, func, string, number } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text, Image } from 'react-native';
import Button from '~UI/Button';
import { PLANNED, IN_PROGRESS, COMPLETED } from '~constants/boardType';
import { IMG_URL } from '~config/api';
import { SECONDARY } from '~constants/themes';
import HeartIcon from '~assets/heart.svg';
import DropdownIcon from '~assets/dropdown.svg';
import colors from '~styles/colors';
import styles from './styles';

const getStatusColor = (bookStatus) =>
  ({
    [PLANNED]: colors.planned,
    [IN_PROGRESS]: colors.in_progress,
    [COMPLETED]: colors.completed,
  }[bookStatus] || colors.neutral_light);

const BookItem = ({ bookItem, showSlideMenu, setSelectedBook }) => {
  const { t } = useTranslation(['books', 'categories']);

  const { title, coverPath, votesCount, pages, categoryValue, authorsList, added, bookStatus } = bookItem;

  const statusColor = getStatusColor(bookStatus);

  const handleChangeStatus = () => {
    showSlideMenu();
    setSelectedBook(bookItem);
  };

  return (
    <View style={styles.bookItem}>
      <View style={styles.leftSide}>
        <Image
          style={styles.cover}
          source={{
            uri: IMG_URL(`${coverPath}.webp`),
          }}
        />
      </View>
      <View style={styles.rightSide}>
        <View style={styles.titleWrapper}>
          <Text style={[styles.title, styles.lightColor]}>{title}</Text>
        </View>
        {authorsList.map((author) => (
          <View key={author}>
            <Text style={[styles.item, styles.mediumColor]}>{author}</Text>
          </View>
        ))}
        <View style={styles.info}>
          <Text style={[styles.item, styles.mediumColor]}>
            {t('category')}
            <Text style={styles.lightColor}>{t(`categories:${categoryValue}`)}</Text>
          </Text>
          <Text style={[styles.item, styles.mediumColor]}>
            {t('pages')}
            <Text style={styles.lightColor}>{pages}</Text>
          </Text>
          {bookStatus && (
            <Text style={[styles.item, styles.mediumColor]}>
              {t('added')}
              <Text style={styles.lightColor}>{new Date(added).toLocaleDateString('ru-RU')}</Text>
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title={t(bookStatus) || t('noStatus')}
            style={[styles.statusButton, { borderColor: statusColor }]}
            titleStyle={[styles.buttonTitle, { color: statusColor }]}
            icon={<DropdownIcon width='16' height='16' style={{ fill: statusColor }} />}
            iconPosition='right'
            iconClassName={styles.buttonIcon}
            theme={SECONDARY}
            onPress={handleChangeStatus}
          />
          <View style={styles.ratingWrapper}>
            <HeartIcon width='26' height='26' />
            <Text style={styles.lightColor}>{votesCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

BookItem.propTypes = {
  bookItem: shape({
    _id: string,
    bookId: string,
    title: string,
    bookStatus: string,
    categoryPath: string,
    coverPath: string,
    votesCount: number,
    status: string,
    pages: number,
    added: number,
  }).isRequired,
  showSlideMenu: func.isRequired,
  setSelectedBook: func.isRequired,
};

export default BookItem;
