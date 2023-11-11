import { createSelector } from 'reselect';
import { getT } from '~translations/i18n';

const getBooks = (state) => state.books;
const getSearch = (state) => getBooks(state).search;
const getCategories = (state) => getBooks(state).categories;
const getBoard = (state) => getBooks(state).board;
const getBookDetails = (state) => getBooks(state).bookDetails;

export const getBoardType = (state) => getBooks(state).boardType;
export const getBookVotes = (state) => getBooks(state).bookVotes;
export const getUpdatingVotesForBooks = (state) => getBooks(state).updatingVotesForBooks;
export const getActiveModal = (state) => getBooks(state).activeModal;
export const getSelectedBook = (state) => getBooks(state).selectedBook;
export const getSearchQuery = (state) => getSearch(state).query;
export const getSearchResults = (state) => getSearch(state).data;
export const getLoadingSearchResultsStatus = (state) => getSearch(state).loadingDataStatus;
export const getShouldReloadSearchResults = (state) => getSearch(state).shouldReloadData;
export const getSearchResultsPagination = (state) => getSearch(state).pagination;
export const getSearchResultsHasNextPage = (state) => getSearchResultsPagination(state).hasNextPage;
export const getSearchResultsTotalItems = (state) => getSearchResultsPagination(state).totalItems;
export const getSearchResultsPageIndex = (state) => getSearchResultsPagination(state).pageIndex;
export const getSearchSortParams = (state) => getSearch(state).sortParams;
export const getSearchSortType = (state) => getSearchSortParams(state).type;
export const getSearchSortDirection = (state) => getSearchSortParams(state).direction;
export const getShouldClearSearchQuery = (state) => getSearch(state).shouldClearSearchQuery;

export const getUpdatingBookStatus = (state) => getBooks(state).updatingBookStatus;
export const getCategoriesData = (state) => getCategories(state).data;
export const getShouldReloadCategories = (state) => getCategories(state).shouldReloadData;

export const getLoadingBookDetailsStatus = (state) => getBookDetails(state).loadingDataStatus;
export const getBookDetailsData = (state) => getBookDetails(state).data;

export const deriveBookListEditableFilterParams = (status) => createSelector([getBoard], (board) => board[status].editableFilterParams);
export const deriveBookListFilterParams = (status) => createSelector([getBoard], (board) => board[status].filterParams);

export const deriveEditableIndeterminatedCategories = (status) =>
  createSelector([deriveBookListEditableFilterParams(status)], (editableFilterParams) => editableFilterParams.indeterminated);

export const deriveIndeterminatedCategories = (status) =>
  createSelector([deriveBookListFilterParams(status)], (filterParams) => filterParams.indeterminated);

export const deriveEditableExpandedCategories = (status) =>
  createSelector([deriveBookListEditableFilterParams(status)], (editableFilterParams) => editableFilterParams.expanded);

export const deriveExpandedCategories = (status) => createSelector([deriveBookListFilterParams(status)], (filterParams) => filterParams.expanded);

export const deriveBookVotes = (bookIdExternal) =>
  createSelector([getBookVotes], (bookVotes) => bookVotes.some(({ bookId }) => bookId === bookIdExternal));

export const deriveUpdatingVoteForBook = (bookId) =>
  createSelector([getUpdatingVotesForBooks], (updatingVotesForBooks) => updatingVotesForBooks.some((item) => bookId === item));

export const deriveCategorySearchQuery = (status) =>
  createSelector([deriveBookListEditableFilterParams(status)], (editableFilterParams) => editableFilterParams.categorySearchQuery);

export const deriveFilterBookCategoryPaths = (status) =>
  createSelector([deriveBookListFilterParams(status)], (filterParams) => filterParams.categoryPaths.filter((item) => item.split('.').length === 3));

export const deriveSearchQuery = createSelector([getSearchQuery], (query) => query.trim());

export const deriveCategoriesSearchResult = (status) =>
  createSelector([getCategoriesData, deriveCategorySearchQuery(status)], (categories, query) => {
    const searchQuery = query.trim().toLowerCase();
    return searchQuery
      ? categories
          .filter(({ path }) => path.split('.').length === 3)
          .map((item) => ({ ...item, title: item.value, label: getT('categories')(item.value) }))
          .filter(({ label }) => label.toLowerCase().includes(searchQuery))
      : [];
  });

export const deriveBookListData = (status) =>
  createSelector([getBoard, getCategoriesData], (board, categories) =>
    board[status].data.map((book) => ({ ...book, categoryValue: categories.find((category) => category.path === book.categoryPath).value })),
  );

export const deriveSearchBookListData = createSelector([getSearchResults, getCategoriesData], (searchResults, categories) =>
  searchResults.map((book) => ({ ...book, categoryValue: categories.find((category) => category.path === book.categoryPath).value })),
);

export const deriveBookDetails = createSelector([getBookDetailsData, getCategoriesData], (bookDetails, categories) => ({
  ...bookDetails,
  categoryValue: categories.find((category) => category.path === bookDetails.categoryPath)?.value,
}));

export const deriveLoadingBookListStatus = (status) => createSelector([getBoard], (board) => board[status].loadingDataStatus);

export const deriveShouldReloadBookList = (status) => createSelector([getBoard], (board) => board[status].shouldReloadData);

export const deriveShouldReloadWithPullRefresh = (status) => createSelector([getBoard], (board) => board[status].shouldReloadWithPullRefresh);

export const deriveBookListPagination = (status) => createSelector([getBoard], (board) => board[status].pagination);

export const deriveBookListTotalItems = (status) => createSelector([deriveBookListPagination(status)], (pagination) => pagination.totalItems);

export const deriveBookListHasNextPage = (status) => createSelector([deriveBookListPagination(status)], (pagination) => pagination.hasNextPage);

export const deriveBookListPageIndex = (status) => createSelector([deriveBookListPagination(status)], (pagination) => pagination.pageIndex);

export const deriveBookListSortParams = (status) => createSelector([getBoard], (board) => board[status].sortParams);

export const deriveNestedCategories = (fullPath) =>
  createSelector([getCategoriesData], (categories) => {
    const splittedPath = fullPath.split('.');
    const level = splittedPath.length;
    if (level === 1) {
      return categories
        .filter(({ path }) => {
          const innerSplittedPath = path.split('.');
          return innerSplittedPath[0] === splittedPath[0];
        })
        .map(({ path }) => path);
    }
    if (level === 2) {
      return categories
        .filter(({ path }) => {
          const innerSplittedPath = path.split('.');
          return innerSplittedPath[0] === splittedPath[0] && innerSplittedPath[1] === splittedPath[1];
        })
        .map(({ path }) => path);
    }
    return [];
  });

export const getCategoryLength = (array, splittedPath, level, level1, level2) =>
  array.filter((item) => {
    const innerSplittedPath = (item.path || item).split('.');
    if (level2) {
      return (
        innerSplittedPath.length === level && innerSplittedPath[level1] === splittedPath[level1] && innerSplittedPath[level2] === splittedPath[level2]
      );
    }
    return innerSplittedPath.length === level && innerSplittedPath[level1] === splittedPath[level1];
  }).length;

export const deriveManageTopLevelCategorySelection = (fullPath, status) =>
  createSelector(
    [getCategoriesData, deriveBookListEditableFilterParams(status), deriveEditableIndeterminatedCategories(status)],
    (categories, filterParams, indeterminatedCategories) => {
      const splittedPath = fullPath.split('.');
      const level = splittedPath.length;
      const { categoryPaths } = filterParams;
      const topLevelCategory = `${splittedPath[0]}`;

      if (level === 1) {
        const categoriesToRemoveFromIndeterminated = indeterminatedCategories.filter((path) => {
          const internalSplittedPath = path.split('.');
          const theFirstLevel = internalSplittedPath[0];
          return theFirstLevel === splittedPath[0] ? path : null;
        });
        // rename categoryPath => categoriesToRemoveFromIndeterminated
        return { categoryPath: categoriesToRemoveFromIndeterminated };
      }

      // handling select for the second level items (without nested items)
      if (level === 2) {
        const topLevelCategoryLength = getCategoryLength(categories, splittedPath, 2, 0);
        const selectedCategoryLength = getCategoryLength(categoryPaths, splittedPath, 2, 0);
        if (selectedCategoryLength === 0) {
          return { shouldUnselectTopLevelCategory: true, categoryPath: topLevelCategory };
        }
        if (topLevelCategoryLength - selectedCategoryLength === 0) {
          return { shouldSelectTopLevelCategory: true, categoryPath: topLevelCategory };
        }
        return { shouldIndeterminateTopLevelCategory: topLevelCategory };

        // TODO: handle indeterminate state
      }
      // handling select for the third level items (without nested items)
      if (level === 3) {
        const current2LevelCategoryLength = getCategoryLength(categories, splittedPath, 3, 0, 1);
        const selected2LevelCategoryLength = getCategoryLength(categoryPaths, splittedPath, 3, 0, 1);

        const secondLevelCategory = `${splittedPath[0]}.${splittedPath[1]}`;

        const current1LevelCategoryLength = getCategoryLength(categories, splittedPath, 3, 0);
        const selected1LevelCategoryLength = getCategoryLength(categoryPaths, splittedPath, 3, 0);

        if (current2LevelCategoryLength - selected2LevelCategoryLength === 0 && current1LevelCategoryLength - selected1LevelCategoryLength === 0) {
          return { shouldSelectTopLevelCategory: true, shouldUnselectTopLevelCategory: false, categoryPath: [secondLevelCategory, topLevelCategory] };
        }
        if (selected2LevelCategoryLength === 0 && selected1LevelCategoryLength === 0) {
          return { shouldUnselectTopLevelCategory: true, shouldSelectTopLevelCategory: false, categoryPath: [secondLevelCategory, topLevelCategory] };
        }
        if (current2LevelCategoryLength - selected2LevelCategoryLength === 0) {
          return {
            shouldSelectTopLevelCategory: true,
            shouldUnselectTopLevelCategory: false,
            categoryPath: secondLevelCategory,
            shouldIndeterminateTopLevelCategory: topLevelCategory,
          };
        }
        if (selected2LevelCategoryLength === 0) {
          return {
            shouldUnselectTopLevelCategory: true,
            shouldSelectTopLevelCategory: false,
            categoryPath: secondLevelCategory,
            shouldIndeterminateTopLevelCategory: topLevelCategory,
          };
        }
        return {
          shouldIndeterminateTopLevelCategory: [secondLevelCategory, topLevelCategory],
          shouldUnselectTopLevelCategory: true,
          categoryPath: [secondLevelCategory, topLevelCategory],
        };
      }
      return 0;
    },
  );

export const deriveCategories = (boardType) =>
  createSelector([getCategoriesData, deriveEditableExpandedCategories(boardType)], (categories, expandedCategories) =>
    categories
      .map(({ path, value }) => {
        const firstLevel = path.split('.');
        if (firstLevel.length === 1) {
          return {
            path,
            title: value,
            isExpanded: expandedCategories.includes(path),
            data: categories
              .map(({ path, value }) => {
                const secondLevel = path.split('.');
                if (secondLevel.length === 2 && firstLevel[0] === secondLevel[0]) {
                  return {
                    path,
                    title: value,
                    isExpanded: expandedCategories.includes(path),
                    data: categories
                      .map(({ path, value }) => {
                        const thirdLevel = path.split('.');
                        if (thirdLevel.length === 3 && firstLevel[0] === thirdLevel[0] && thirdLevel[1] === secondLevel[1]) {
                          return {
                            path,
                            title: value,
                          };
                        }
                        return null;
                      })
                      .filter((item) => item !== null),
                  };
                }
                return null;
              })
              .filter((item) => item !== null),
          };
        }
        return null;
      })
      .filter((item) => item !== null),
  );
