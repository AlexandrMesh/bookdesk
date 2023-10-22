import { connect } from 'react-redux';
import {
  deriveBookListData,
  deriveLoadingBookListStatus,
  deriveBookListFilterParams,
  deriveBookListHasNextPage,
  deriveShouldReloadBookList,
  deriveBookListTotalItems,
  deriveShouldReloadWithPullRefresh,
  deriveFilterBookCategoryPaths,
} from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, loadCategories, setBoardType, showModal } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import { FILTERING } from '~constants/modalTypes';
import SearchResults from './AllBooks';

const mapStateToProps = (state) => ({
  bookList: deriveBookListData(ALL)(state),
  loadingDataStatus: deriveLoadingBookListStatus(ALL)(state),
  filterParams: deriveBookListFilterParams(ALL)(state),
  hasNextPage: deriveBookListHasNextPage(ALL)(state),
  shouldReloadData: deriveShouldReloadBookList(ALL)(state),
  shouldReloadWithPullRefresh: deriveShouldReloadWithPullRefresh(ALL)(state),
  totalItems: deriveBookListTotalItems(ALL)(state),
  activeFiltersCount: deriveFilterBookCategoryPaths(ALL)(state)?.length,
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(ALL)),
  loadCategories: () => dispatch(loadCategories()),
  setBoardType: () => dispatch(setBoardType(ALL)),
  showFilters: () => dispatch(showModal(FILTERING)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
