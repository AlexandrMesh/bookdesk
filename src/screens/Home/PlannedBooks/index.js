import { connect } from 'react-redux';
import {
  deriveLoadingBookListStatus,
  deriveBookListHasNextPage,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
  deriveSectionedBookListData,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { PLANNED } from '~constants/boardType';
import PlannedBooks from './PlannedBooks';

const mapStateToProps = (state) => ({
  sectionedBookListData: deriveSectionedBookListData(PLANNED)(state),
  loadingDataStatus: deriveLoadingBookListStatus(PLANNED)(state),
  hasNextPage: deriveBookListHasNextPage(PLANNED)(state),
  shouldReloadData: deriveShouldReloadBookList(PLANNED)(state),
  totalItems: deriveBookListTotalItems(PLANNED)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(PLANNED)),
  setBoardType: () => dispatch(setBoardType(PLANNED)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlannedBooks);
