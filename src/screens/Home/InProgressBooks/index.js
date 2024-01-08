import { connect } from 'react-redux';
import {
  deriveBookListHasNextPage,
  deriveLoadingBookListStatus,
  deriveBookListTotalItems,
  deriveShouldReloadBookList,
  deriveSectionedBookListData,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, setBoardType } from '~redux/actions/booksActions';
import { IN_PROGRESS } from '~constants/boardType';
import InProgressBooks from './InProgressBooks';

const mapStateToProps = (state) => ({
  sectionedBookListData: deriveSectionedBookListData(IN_PROGRESS)(state),
  loadingDataStatus: deriveLoadingBookListStatus(IN_PROGRESS)(state),
  hasNextPage: deriveBookListHasNextPage(IN_PROGRESS)(state),
  shouldReloadData: deriveShouldReloadBookList(IN_PROGRESS)(state),
  totalItems: deriveBookListTotalItems(IN_PROGRESS)(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(IN_PROGRESS)),
  setBoardType: () => dispatch(setBoardType(IN_PROGRESS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InProgressBooks);
