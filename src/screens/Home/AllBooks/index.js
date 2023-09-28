import { connect } from 'react-redux';
import {
  deriveBookListData,
  deriveLoadingBookListStatus,
  deriveBookListFilterParams,
  deriveBookListHasNextPage,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, loadCategories, setBoardType, clearBoardType, showModal } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import SearchResults from './AllBooks';

const mapStateToProps = (state) => ({
  bookList: deriveBookListData(ALL)(state),
  loadingDataStatus: deriveLoadingBookListStatus(ALL)(state),
  filterParams: deriveBookListFilterParams(ALL)(state),
  hasNextPage: deriveBookListHasNextPage(ALL)(state),
  shouldReloadData: deriveShouldReloadBookList(ALL)(state),
  totalItems: deriveBookListTotalItems(ALL)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(ALL)),
  loadCategories: () => dispatch(loadCategories()),
  setBoardType: () => dispatch(setBoardType(ALL)),
  clearBoardType: () => dispatch(clearBoardType),
  showFilters: () => dispatch(showModal('filtering')),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
