import { connect } from 'react-redux';
import {
  deriveBookListData,
  deriveBookListHasNextPage,
  deriveLoadingBookListStatus,
  deriveBookListFilterParams,
  deriveBookListTotalItems,
  deriveShouldReloadBookList,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType, clearBoardType } from '~redux/actions/booksActions';
import { IN_PROGRESS } from '~constants/boardType';
import InProgressBooks from './InProgressBooks';

const mapStateToProps = (state) => ({
  bookList: deriveBookListData(IN_PROGRESS)(state),
  loadingDataStatus: deriveLoadingBookListStatus(IN_PROGRESS)(state),
  hasNextPage: deriveBookListHasNextPage(IN_PROGRESS)(state),
  filterParams: deriveBookListFilterParams(IN_PROGRESS)(state),
  totalItems: deriveBookListTotalItems(IN_PROGRESS)(state),
  shouldReloadData: deriveShouldReloadBookList(IN_PROGRESS)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(IN_PROGRESS)),
  setBoardType: () => dispatch(setBoardType(IN_PROGRESS)),
  clearBoardType: () => dispatch(clearBoardType),
});

export default connect(mapStateToProps, mapDispatchToProps)(InProgressBooks);
