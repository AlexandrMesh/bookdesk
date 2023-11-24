import { connect } from 'react-redux';
import { getActiveModal } from '~redux/selectors/books';
import { getStatus } from '~redux/selectors/customBook';
import { hideModal } from '~redux/actions/booksActions';
import { setStatus } from '~redux/actions/customBookActions';
import { CUSTOM_BOOK_STATUS } from '~constants/modalTypes';
import CustomBookStatusModal from './CustomBookStatusModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === CUSTOM_BOOK_STATUS,
  status: getStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  setStatus: (status) => dispatch(setStatus(status)),
  hideModal: () => dispatch(hideModal),
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomBookStatusModal);
