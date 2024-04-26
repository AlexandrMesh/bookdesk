import { connect } from 'react-redux';
import {
  getActiveModal,
  getBoardType,
  getSelectedBook,
  getBookCommentLoadingStatus,
  getUserBookRatingLoadingStatus,
  getBookCommentData,
} from '~redux/selectors/books';
import {
  getBookComment,
  getUserBookRating,
  updateUserBookRating,
  updateUserBook,
  updateUserComment,
  hideModal,
  clearBookComment,
  deleteUserComment,
  deleteUserBookRating,
  updateUserBookCommentInBookDetails,
} from '~redux/actions/booksActions';
import { BOOK_STATUS } from '~constants/modalTypes';
import BookStatusModal from './BookStatusModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === BOOK_STATUS,
  boardType: getBoardType(state),
  book: getSelectedBook(state),
  bookCommentLoadingStatus: getBookCommentLoadingStatus(state),
  userBookRatingLoadingStatus: getUserBookRatingLoadingStatus(state),
  bookComment: getBookCommentData(state)?.comment || '',
});

const mapDispatchToProps = (dispatch) => ({
  getBookComment: (params) => dispatch(getBookComment(params)),
  getUserBookRating: (params) => dispatch(getUserBookRating(params)),
  updateUserBookRating: (params) => dispatch(updateUserBookRating(params)),
  updateUserBook: (params) => dispatch(updateUserBook(params)),
  updateUserComment: (params) => dispatch(updateUserComment(params)),
  clearBookComment: () => dispatch(clearBookComment),
  hideModal: () => dispatch(hideModal),
  deleteUserComment: (bookId) => dispatch(deleteUserComment(bookId)),
  deleteUserBookRating: (bookId) => dispatch(deleteUserBookRating(bookId)),
  updateUserBookCommentInBookDetails: (comment, commentAdded) => dispatch(updateUserBookCommentInBookDetails(comment, commentAdded)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookStatusModal);
