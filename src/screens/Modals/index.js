import { connect } from 'react-redux';
import { getUpdatingBookStatus } from '~redux/selectors/books';
import { loadBookList, loadMoreBooks, loadCategories } from '~redux/actions/booksActions';
import { ALL } from '~constants/boardType';
import SearchResults from './Modals';

const mapStateToProps = (state) => ({
  updatingBookStatus: getUpdatingBookStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookList: ({ boardType, shouldLoadMoreResults }) => dispatch(loadBookList({ boardType, shouldLoadMoreResults })),
  loadMoreBooks: () => dispatch(loadMoreBooks(ALL)),
  loadCategories: () => dispatch(loadCategories()),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults);
