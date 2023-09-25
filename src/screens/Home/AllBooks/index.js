import { connect } from 'react-redux';
import {
  deriveBookListData,
  deriveLoadingBookListStatus,
  deriveBookListFilterParams,
  deriveBookListEditableFilterParams,
  deriveBookListHasNextPage,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, loadCategories, resetFilterParams } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import SearchResults from './AllBooks';

const mapStateToProps = (state) => ({
  bookList: deriveBookListData(ALL)(state),
  loadingDataStatus: deriveLoadingBookListStatus(ALL)(state),
  filterParams: deriveBookListFilterParams(ALL)(state),
  editableFilterParams: deriveBookListEditableFilterParams(ALL)(state),
  hasNextPage: deriveBookListHasNextPage(ALL)(state),
  shouldReloadData: deriveShouldReloadBookList(ALL)(state),
  totalItems: deriveBookListTotalItems(ALL)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(ALL)),
  loadCategories: () => dispatch(loadCategories()),
  resetFilterParams: (boardType) => dispatch(resetFilterParams(boardType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
