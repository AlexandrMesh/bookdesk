import { connect } from 'react-redux';
import { getActiveModal } from '~redux/selectors/books';
import { hideModal } from '~redux/actions/booksActions';
import { EDIT_GOAL } from '~constants/modalTypes';
import EditGoalModal from './EditGoalModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === EDIT_GOAL,
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGoalModal);
