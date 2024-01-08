import { connect } from 'react-redux';
import {
  deriveBookListHasNextPage,
  deriveLoadingBookListStatus,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
  deriveSectionedBookListData,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { COMPLETED } from '~constants/boardType';
import CompletedBooks from './CompletedBooks';

const mapStateToProps = (state) => ({
  sectionedBookListData: deriveSectionedBookListData(COMPLETED)(state),
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
