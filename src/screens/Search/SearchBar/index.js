import { connect } from 'react-redux';
import { setSearchQuery, clearSearchResults } from '~redux/actions/booksActions';
import { deriveSearchQuery } from '~redux/selectors/books';
import SearchBar from './SearchBar';

const mapStateToProps = (state) => ({
  searchQuery: deriveSearchQuery(state),
});

const mapDispatchToProps = (dispatch) => ({
  setSearchQuery: (query) => dispatch(setSearchQuery(query)),
  clearSearchResults: () => dispatch(clearSearchResults),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
