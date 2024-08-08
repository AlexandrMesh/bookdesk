import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getNewCustomBookNameValue, getSuggestedBooksSortParams, deriveCustomBookParams, getStatus } from '~redux/selectors/customBook';

import { triggerReloadBookList } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import DataService from '~http/services/books';
import CustomBooksService from '~http/services/customBooks';
import i18n, { getT } from '~translations/i18n';
import { BookStatus, IBook } from '~types/books';
import { ICover } from '~types/customBooks';
import { AppThunkAPI } from '~redux/store/configureStore';

const PREFIX = 'CUSTOM_BOOKS';

export const bookAdded = createAction(`${PREFIX}/bookAdded`);
export const startAddingBook = createAction(`${PREFIX}/startAddingBook`);
export const addingBookFailed = createAction(`${PREFIX}/addingBookFailed`);
export const submitCategory = createAction(`${PREFIX}/submitCategory`);
export const clearCategory = createAction(`${PREFIX}/clearCategory`);
export const clearAddCustomBookState = createAction(`${PREFIX}/clearAddCustomBookState`);
export const clearStep2 = createAction(`${PREFIX}/clearStep2`);
export const clearStep3 = createAction(`${PREFIX}/clearStep3`);
export const setCurrentStep = createAction<number>(`${PREFIX}/setCurrentStep`);
export const setAvailableStep = createAction<number>(`${PREFIX}/setAvailableStep`);
export const addAuthor = createAction<string>(`${PREFIX}/addAuthor`);
export const setAnnotation = createAction<{ annotation: string; error: string | null | undefined }>(`${PREFIX}/setAnnotation`);
export const setAnnotationError = createAction<any>(`${PREFIX}/setAnnotationError`);
export const updateAuthor = createAction<{ id: string; name: string; error: string | null | undefined }>(`${PREFIX}/updateAuthor`);
export const removeAuthor = createAction<string>(`${PREFIX}/removeAuthor`);
export const setPages = createAction<{ pages: string | null; error: string | null | undefined }>(`${PREFIX}/setPages`);
export const selectCover = createAction<string>(`${PREFIX}/selectCover`);
export const setSearchQuery = createAction<string>(`${PREFIX}/setSearchQuery`);
export const setShouldAddCover = createAction<boolean>(`${PREFIX}/setShouldAddCover`);
export const setNewCustomBookName = createAction<{ name: string; error: string | null }>(`${PREFIX}/setNewCustomBookName`);
export const allowToAddBook = createAction<boolean>(`${PREFIX}/allowToAddBook`);
export const setNewCustomBookError = createAction<string>(`${PREFIX}/setNewCustomBookError`);
export const clearSuggestedBooks = createAction(`${PREFIX}/clearSuggestedBooks`);
export const startLoadingSuggestedBooks = createAction(`${PREFIX}/startLoadingSuggestedBooks`);
export const loadingSuggestedBooksFailed = createAction(`${PREFIX}/loadingSuggestedBooksFailed`);
export const suggestedBooksLoaded = createAction<{ data: IBook[]; totalItems: number; hasNextPage: boolean; allowToAddBook: boolean }>(
  `${PREFIX}/suggestedBooksLoaded`,
);
export const startLoadingSuggestedCovers = createAction(`${PREFIX}/startLoadingSuggestedCovers`);
export const loadingSuggestedCoversFailed = createAction(`${PREFIX}/loadingSuggestedCoversFailed`);
export const suggestedCoversLoaded = createAction<ICover[]>(`${PREFIX}/suggestedCoversLoaded`);
export const toggleExpandedCategoryCustomBooks = createAction<string>(`${PREFIX}/toggleExpandedCategoryCustomBooks`);
export const selectCategory = createAction<{ path: string; label: string }>(`${PREFIX}/selectCategory`);
export const setStatus = createAction<BookStatus>(`${PREFIX}/setStatus`);
export const updateSuggestedBook = createAction<{ bookId: string; bookStatus: BookStatus; added: number }>(`${PREFIX}/updateSuggestedBook`);
export const updateBookVotesInSuggestedBook = createAction<{ bookId: string; votesCount: number }>(`${PREFIX}/updateBookVotesInSuggestedBook`);

export const loadSuggestedBooks = createAsyncThunk(
  `${PREFIX}/loadSuggestedBooks`,
  async (bookName: string, { dispatch, getState }: AppThunkAPI): Promise<string | null> => {
    const state = getState();
    const sortParams = getSuggestedBooksSortParams(state);
    const { language } = i18n;

    const params = {
      limit: 10,
      pageIndex: 0,
      boardType: ALL,
      title: bookName,
      sortType: sortParams.type,
      sortDirection: sortParams.direction,
      language,
    };

    try {
      dispatch(startLoadingSuggestedBooks());
      const { data } = (await DataService().getBookList({ ...params, exact: true })) || {};
      const { items, pagination } = data || {};
      if (data && items?.length > 0) {
        dispatch(setNewCustomBookError(getT('errors')('bookExists')));
        dispatch(allowToAddBook(false));
        dispatch(
          suggestedBooksLoaded({
            data: items || [],
            totalItems: pagination?.totalItems || 0,
            hasNextPage: pagination?.hasNextPage || false,
            allowToAddBook: false,
          }),
        );
        return getT('errors')('bookExists');
      }
      const { data: dataBookList } = (await DataService().getBookList({ ...params })) || {};
      dispatch(allowToAddBook(true));
      dispatch(
        suggestedBooksLoaded({
          data: dataBookList.items || [],
          totalItems: dataBookList.pagination?.totalItems || 0,
          hasNextPage: dataBookList.pagination?.hasNextPage || false,
          allowToAddBook: true,
        }),
      );
      return null;
    } catch (error) {
      console.error(error);
      dispatch(loadingSuggestedBooksFailed());
      return null;
    }
  },
);

export const loadSuggestedCovers = createAsyncThunk(`${PREFIX}/loadSuggestedCovers`, async (_, { dispatch, getState }: AppThunkAPI) => {
  const state = getState();
  const bookName = getNewCustomBookNameValue(state);
  const { language } = i18n;

  const params = {
    bookName,
    language,
  };

  try {
    dispatch(startLoadingSuggestedCovers());
    const { data } = (await CustomBooksService().getSuggestCoversList({ ...params })) || {};
    const { items } = data || {};
    dispatch(suggestedCoversLoaded(items || []));
  } catch (error) {
    console.error(error);
    dispatch(loadingSuggestedCoversFailed());
  }
});

export const addCustomBook = createAsyncThunk(`${PREFIX}/addCustomBook`, async (_, { dispatch, getState }: AppThunkAPI) => {
  const { language } = i18n;
  const state = getState();
  const bookStatus = getStatus(state);
  const customBookParams = deriveCustomBookParams(state);
  const params = { ...customBookParams, language };
  try {
    dispatch(startAddingBook());
    await CustomBooksService().addCustomBook({ ...params });
    dispatch(bookAdded());
    if (bookStatus !== ALL) {
      // ставим метку о том что надо перезагрузить определенную доску где произошли изменения (добавилась книга например)
      dispatch(triggerReloadBookList(bookStatus));
    }
  } catch (error) {
    console.error(error);
    dispatch(addingBookFailed());
  }
});
