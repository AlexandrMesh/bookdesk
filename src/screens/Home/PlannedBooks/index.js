import { connect } from 'react-redux';
import {
  deriveLoadingBookListStatus,
  deriveBookListData,
  deriveBookListHasNextPage,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
  deriveShouldReloadWithPullRefresh,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { PLANNED } from '~constants/boardType';
import PlannedBooks from './PlannedBooks';

const mapStateToProps = (state) => ({
  bookList: deriveBookListData(PLANNED)(state),
  loadingDataStatus: deriveLoadingBookListStatus(PLANNED)(state),
  hasNextPage: deriveBookListHasNextPage(PLANNED)(state),
  shouldReloadData: deriveShouldReloadBookList(PLANNED)(state),
  shouldReloadWithPullRefresh: deriveShouldReloadWithPullRefresh(PLANNED)(state),
  totalItems: deriveBookListTotalItems(PLANNED)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(PLANNED)),
  setBoardType: () => dispatch(setBoardType(PLANNED)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlannedBooks);
