import { connect } from 'react-redux';
import {
  getActiveModal,
  getUpdatingBookStatus,
  getBookCommentUpdatingStatus,
  getBoardType,
  getSelectedBook,
  getBookCommentLoadingStatus,
  getBookCommentData,
} from '~redux/selectors/books';
import { getBookComment, updateUserBook, updateUserComment, hideModal, clearBookComment } from '~redux/actions/booksActions';
import { PENDING } from '~constants/loadingStatuses';
import { BOOK_STATUS } from '~constants/modalTypes';
import BookStatusModal from './BookStatusModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === BOOK_STATUS,
  isLoading: getUpdatingBookStatus(state) === PENDING || getBookCommentUpdatingStatus(state) === PENDING,
  boardType: getBoardType(state),
  book: getSelectedBook(state),
  bookCommentLoadingStatus: getBookCommentLoadingStatus(state),
  bookComment: getBookCommentData(state)?.comment || '',
});

const mapDispatchToProps = (dispatch) => ({
  getBookComment: (params) => dispatch(getBookComment(params)),
  updateUserBook: (params) => dispatch(updateUserBook(params)),
  updateUserComment: (params) => dispatch(updateUserComment(params)),
  clearBookComment: () => dispatch(clearBookComment),
  hideModal: () => dispatch(hideModal),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookStatusModal);
