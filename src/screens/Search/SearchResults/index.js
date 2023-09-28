import { connect } from 'react-redux';
import {
  deriveSearchBookListData,
  deriveSearchQuery,
  getLoadingSearchResultsStatus,
  getSearchResultsHasNextPage,
  getSearchResultsTotalItems,
  getShouldReloadSearchResults,
} from '~redux/selectors/books';
import { loadSearchResults, loadMoreSearchResults, setBoardType, clearBoardType } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import SearchResults from './SearchResults';

const mapStateToProps = (state) => ({
  searchResult: deriveSearchBookListData(state),
  searchQuery: deriveSearchQuery(state),
  loadingDataStatus: getLoadingSearchResultsStatus(state),
  hasNextPage: getSearchResultsHasNextPage(state),
  totalItems: getSearchResultsTotalItems(state),
  shouldReloadData: getShouldReloadSearchResults(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadSearchResults: (shouldLoadMoreResults) => dispatch(loadSearchResults(shouldLoadMoreResults)),
  loadMoreSearchResults: () => dispatch(loadMoreSearchResults(ALL)),
  setBoardType: () => dispatch(setBoardType(ALL)),
  clearBoardType: () => dispatch(clearBoardType),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
