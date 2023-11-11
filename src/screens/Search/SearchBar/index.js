import { connect } from 'react-redux';
import { deriveSearchQuery, getShouldClearSearchQuery } from '~redux/selectors/books';
import { setSearchQuery, clearSearchResults, triggerShouldNotClearSearchQuery } from '~redux/actions/booksActions';
import SearchBar from './SearchBar';

const mapStateToProps = (state) => ({
  searchQuery: deriveSearchQuery(state),
  shouldClearSearchQuery: getShouldClearSearchQuery(state),
});

const mapDispatchToProps = (dispatch) => ({
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  clearSearchResults: () => dispatch(clearSearchResults),
  triggerShouldNotClearSearchQuery: () => dispatch(triggerShouldNotClearSearchQuery),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
