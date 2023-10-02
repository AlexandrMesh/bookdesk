import { connect } from 'react-redux';
import { getActiveModal, getUpdatingBookStatus, getBoardType, getSelectedBook } from '~redux/selectors/books';
import { updateUserBook, hideModal } from '~redux/actions/booksActions';
import { PENDING } from '~constants/loadingStatuses';
import { BOOK_STATUS } from '~constants/modalTypes';
import BookStatusModal from './BookStatusModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === BOOK_STATUS,
  isLoading: getUpdatingBookStatus(state) === PENDING,
  boardType: getBoardType(state),
  book: getSelectedBook(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateUserBook: (params) => dispatch(updateUserBook(params)),
  hideModal: () => dispatch(hideModal),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookStatusModal);
