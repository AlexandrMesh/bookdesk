import { connect } from 'react-redux';
import {
  getLoadingBookDetailsStatus,
  deriveBookDetails,
  getBookValuesUpdatingStatus,
  getBookCommentUpdatingStatus,
  getBookCommentDeletingStatus,
  getBookCommentData,
} from '~redux/selectors/books';
import {
  loadBookDetails,
  showModal,
  clearBookDetails,
  setBookToUpdate,
  setBookValuesToUpdate,
  updateUserComment,
  updateUserBookRating,
  updateUserBookCommentInBookDetails,
  deleteUserComment,
} from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';
import BookDetails from './BookDetails';

const mapStateToProps = (state) => ({
  loadingDataStatus: getLoadingBookDetailsStatus(state),
  bookDetailsData: deriveBookDetails(state),
  bookValuesUpdatingStatus: getBookValuesUpdatingStatus(state),
  bookCommentUpdatingStatus: getBookCommentUpdatingStatus(state),
  bookCommentDeletingStatus: getBookCommentDeletingStatus(state),
  bookCommentData: getBookCommentData(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadBookDetails: (bookId) => dispatch(loadBookDetails(bookId)),
  clearBookDetails: () => dispatch(clearBookDetails),
  setBookToUpdate: (bookId, bookStatus) => dispatch(setBookToUpdate(bookId, bookStatus)),
  setBookValuesToUpdate: (added) => dispatch(setBookValuesToUpdate(added)),
  showDateUpdater: () => dispatch(showModal(DATE_UPDATER)),
  updateUserComment: (params) => dispatch(updateUserComment(params)),
  updateUserBookRating: (params) => dispatch(updateUserBookRating(params)),
  updateUserBookCommentInBookDetails: (comment, commentAdded) => dispatch(updateUserBookCommentInBookDetails(comment, commentAdded)),
  deleteUserComment: (bookId) => dispatch(deleteUserComment(bookId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookDetails);
