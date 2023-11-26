import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { getT } from '~translations/i18n';
import { SUCCEEDED } from '~constants/loadingStatuses';
import { DEFAULT_COVER } from '~constants/customBooks';
// eslint-disable-next-line import/no-cycle
import { getCategoriesData } from '~redux/selectors/books';

const getCustomBook = (state) => state.customBook;
const getAddCustomBook = (state) => getCustomBook(state).add;
const getCustomBookData = (state) => getAddCustomBook(state).book;
const getAddCustomBookSteps = (state) => getAddCustomBook(state).steps;
const getAddCustomBookStep1 = (state) => getAddCustomBookSteps(state)[1];
const getAddCustomBookStep2 = (state) => getAddCustomBookSteps(state)[2];
const getAddCustomBookStep3 = (state) => getAddCustomBookSteps(state)[3];
const getEditableCategory = (state) => getAddCustomBookStep3(state).editableCategory;
const getCategory = (state) => getAddCustomBookStep3(state).category;
const getSuggestedBooks = (state) => getAddCustomBookStep1(state).suggestedBooks;
const getSuggestedBooksPagination = (state) => getSuggestedBooks(state).pagination;

// common
export const getAddedCustomBook = (state) => getCustomBookData(state).added;
export const getSavingCustomBookStatus = (state) => getCustomBookData(state).loadingDataStatus;
export const getCurrentStep = (state) => getAddCustomBook(state).currentStep;
export const getAvailableStep = (state) => getAddCustomBook(state).availableStep;

// step 1
export const getNewCustomBookName = (state) => getAddCustomBookStep1(state).name;
export const getNewCustomBookNameValue = (state) => getNewCustomBookName(state).value.trim();
export const getSuggestedBooksSortParams = (state) => getSuggestedBooks(state).sortParams;
export const getSuggestedBooksData = (state) => getSuggestedBooks(state).data;
export const getSuggestedBooksLoadingStatus = (state) => getSuggestedBooks(state).loadingDataStatus;
export const getSuggestedBooksTotalItems = (state) => getSuggestedBooksPagination(state).totalItems;
export const getAllowToAddBook = (state) => getAddCustomBookStep1(state).allowToAddBook;

// step 2
export const getShouldAddCover = (state) => getAddCustomBookStep2(state).shouldAddCover;
export const getSuggestedCovers = (state) => getAddCustomBookStep2(state).suggestedCovers;
export const getSelectedCover = (state) => getAddCustomBookStep2(state).selectedCover;
export const getSuggestedCoversData = (state) => getSuggestedCovers(state).data;
export const getSuggestedCoversLoadingDataStatus = (state) => getSuggestedCovers(state).loadingDataStatus;

// step 3
export const getEditableSelectedCategory = (state) => getEditableCategory(state).selectedCategory;
export const getEditableSelectedCategoryPath = (state) => getEditableSelectedCategory(state).path;
export const getEditableSelectedCategoryLabel = (state) => getEditableSelectedCategory(state).label;
export const getSelectedCategory = (state) => getCategory(state).selectedCategory;
export const getSelectedCategoryPath = (state) => getSelectedCategory(state).path;
export const getSelectedCategoryLabel = (state) => getSelectedCategory(state).label;
export const getExpandedCategories = (state) => getEditableCategory(state).expanded;
export const getCategorySearchQuery = (state) => getEditableCategory(state).searchQuery;
export const getStatus = (state) => getAddCustomBookStep3(state).status;
export const getPages = (state) => getAddCustomBookStep3(state).pages;
export const getAuthorsList = (state) => getAddCustomBookStep3(state).authorsList;
export const getAnnotation = (state) => getAddCustomBookStep3(state).annotation;

export const deriveCategoriesSearchResult = createSelector([getCategoriesData, getCategorySearchQuery], (categories, query) => {
  const searchQuery = query.trim().toLowerCase();
  return searchQuery
    ? categories
        .filter(({ path }) => path.split('.').length === 3)
        .map((item) => ({ ...item, title: item.value, label: getT('categories')(item.value) }))
        .filter(({ label }) => label.toLowerCase().includes(searchQuery))
    : [];
});

export const deriveIsValidStep1 = createSelector(
  [getAllowToAddBook, getNewCustomBookName, getSuggestedBooksLoadingStatus],
  (allowToAddBook, bookName, loadingDataStatus) => allowToAddBook && isEmpty(bookName.error) && !!bookName.value && loadingDataStatus === SUCCEEDED,
);

export const deriveIsValidStep2 = createSelector(
  [getShouldAddCover, getSelectedCover],
  (shouldAddCover, selectedCover) => shouldAddCover === false || (shouldAddCover === true && !!selectedCover),
);

export const deriveIsValidAuthorsList = createSelector(
  [getAuthorsList],
  (authorsList) => authorsList.length > 0 && authorsList.every(({ name, error }) => name && !error),
);

export const deriveIsValidStep3 = createSelector(
  [getSelectedCategoryPath, getPages, deriveIsValidAuthorsList, getAnnotation],
  (selectedCategoryPath, pages, isValidAuthorsList, annotation) =>
    !!selectedCategoryPath && !!pages.value && !pages.error && isValidAuthorsList && !!annotation.value && !annotation.error,
);

export const deriveIsValidFullForm = createSelector(
  [deriveIsValidStep1, deriveIsValidStep2, deriveIsValidStep3],
  (isValidStep1, isValidStep2, isValidStep3) => isValidStep1 && isValidStep2 && isValidStep3,
);

export const deriveCustomBookParams = createSelector(
  [getNewCustomBookNameValue, getShouldAddCover, getSelectedCover, getSelectedCategoryPath, getStatus, getPages, getAuthorsList, getAnnotation],
  (customBookName, shouldAddCover, selectedCover, selectedCategoryPath, status, pages, authorsList, annotation) => ({
    title: customBookName,
    categoryPath: selectedCategoryPath.trim(),
    coverPath: shouldAddCover ? selectedCover : DEFAULT_COVER,
    authorsList: authorsList.map(({ name }) => name.trim()),
    annotation: annotation.value.trim(),
    pages: Number(pages.value),
    status,
  }),
);

export const deriveSuggestBooksData = createSelector([getSuggestedBooksData, getCategoriesData], (suggestedBooks, categories) =>
  suggestedBooks.map((book) => ({ ...book, categoryValue: categories.find((category) => category.path === book.categoryPath).value })),
);
