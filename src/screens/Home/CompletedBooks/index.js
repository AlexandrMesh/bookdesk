import { connect } from 'react-redux';
import {
  deriveBookListData,
  deriveBookListHasNextPage,
  deriveLoadingBookListStatus,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { COMPLETED } from '~constants/boardType';
import CompletedBooks from './CompletedBooks';

const mapStateToProps = (state) => ({
  bookList: deriveBookListData(COMPLETED)(state),
  loadingDataStatus: deriveLoadingBookListStatus(COMPLETED)(state),
  hasNextPage: deriveBookListHasNextPage(COMPLETED)(state),
  shouldReloadData: deriveShouldReloadBookList(COMPLETED)(state),
  totalItems: deriveBookListTotalItems(COMPLETED)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(COMPLETED)),
  setBoardType: () => dispatch(setBoardType(COMPLETED)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompletedBooks);
