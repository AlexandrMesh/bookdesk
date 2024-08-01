import { connect } from 'react-redux';
import { getLoadingBookDetailsStatus, deriveBookDetails } from '~redux/selectors/books';
import { loadBookDetails, clearBookDetails } from '~redux/actions/booksActions';
import BookDetails from './BookDetails';

const mapStateToProps = (state) => ({
  loadingDataStatus: getLoadingBookDetailsStatus(state),
  bookDetailsData: deriveBookDetails(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookDetails: (bookId) => dispatch(loadBookDetails(bookId)),
  clearBookDetails: () => dispatch(clearBookDetails),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
