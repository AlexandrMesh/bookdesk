import { connect } from 'react-redux';
import { getLoadingBookDetailsStatus, deriveBookDetails, deriveBookVotes, deriveUpdatingVoteForBook } from '~redux/selectors/books';
import { loadBookDetails, updateBookVotes, showModal, selectBook, clearBookDetails } from '~redux/actions/booksActions';
import BookDetails from './BookDetails';

const mapStateToProps = (state, ownProps) => ({
  bookWithVote: deriveBookVotes(ownProps.route.params.bookId)(state),
  updatingVoteForBook: deriveUpdatingVoteForBook(ownProps.route.params.bookId)(state),
  loadingDataStatus: getLoadingBookDetailsStatus(state),
  bookDetailsData: deriveBookDetails(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookDetails: (bookId) => dispatch(loadBookDetails(bookId)),
  updateBookVotes: ({ bookId, shouldAdd, bookStatus }) => dispatch(updateBookVotes({ bookId, shouldAdd, bookStatus })),
  showModal: (modal) => dispatch(showModal(modal)),
  selectBook: (book) => dispatch(selectBook(book)),
  clearBookDetails: () => dispatch(clearBookDetails),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
