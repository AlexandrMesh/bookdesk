import { connect } from 'react-redux';
import {
  getLoadingBookDetailsStatus,
  deriveBookDetails,
  deriveBookVotes,
  deriveUpdatingVoteForBook,
  getBookValuesUpdatingStatus,
  getBookCommentUpdatingStatus,
  getBookCommentDeletingStatus,
} from '~redux/selectors/books';
import {
  loadBookDetails,
  updateBookVotes,
  showModal,
  selectBook,
  clearBookDetails,
  setBookToUpdate,
  setBookValuesToUpdate,
  updateUserComment,
  updateUserBookCommentInBookDetails,
  deleteUserComment,
} from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';
import BookDetails from './BookDetails';

const mapStateToProps = (state, ownProps) => ({
  bookWithVote: deriveBookVotes(ownProps.route.params.bookId)(state),
  updatingVoteForBook: deriveUpdatingVoteForBook(ownProps.route.params.bookId)(state),
  loadingDataStatus: getLoadingBookDetailsStatus(state),
  bookDetailsData: deriveBookDetails(state),
  bookValuesUpdatingStatus: getBookValuesUpdatingStatus(state),
  bookCommentUpdatingStatus: getBookCommentUpdatingStatus(state),
  bookCommentDeletingStatus: getBookCommentDeletingStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookDetails: (bookId) => dispatch(loadBookDetails(bookId)),
  updateBookVotes: ({ bookId, shouldAdd, bookStatus }) => dispatch(updateBookVotes({ bookId, shouldAdd, bookStatus })),
  showModal: (modal) => dispatch(showModal(modal)),
  selectBook: (book) => dispatch(selectBook(book)),
  clearBookDetails: () => dispatch(clearBookDetails),
  setBookToUpdate: (bookId, bookStatus) => dispatch(setBookToUpdate(bookId, bookStatus)),
  setBookValuesToUpdate: (added) => dispatch(setBookValuesToUpdate(added)),
  showDateUpdater: () => dispatch(showModal(DATE_UPDATER)),
  updateUserComment: (params) => dispatch(updateUserComment(params)),
  updateUserBookCommentInBookDetails: (comment, commentAdded) => dispatch(updateUserBookCommentInBookDetails(comment, commentAdded)),
  deleteUserComment: (bookId) => dispatch(deleteUserComment(bookId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
