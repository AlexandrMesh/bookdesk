import { connect } from 'react-redux';
import { getActiveModal, getBookValuesToUpdate } from '~redux/selectors/books';
import { hideModal, updateUserBookAddedDate } from '~redux/actions/booksActions';
import { DATE_UPDATER } from '~constants/modalTypes';
import DateUpdater from './DateUpdater';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === DATE_UPDATER,
  added: getBookValuesToUpdate(state).added,
});

const mapDispatchToProps = (dispatch) => ({
  hideDateUpdater: () => dispatch(hideModal),
  updateUserBookAddedDate: (added) => dispatch(updateUserBookAddedDate({ added })),
});

export default connect(mapStateToProps, mapDispatchToProps)(DateUpdater);
