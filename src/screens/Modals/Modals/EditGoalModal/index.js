import { connect } from 'react-redux';
import { getActiveModal } from '~redux/selectors/books';
import { hideModal } from '~redux/actions/booksActions';
import { getGoalNumberOfPages } from '~redux/selectors/goals';
import { updateGoal } from '~redux/actions/goalsActions';
import { EDIT_GOAL } from '~constants/modalTypes';
import EditGoalModal from './EditGoalModal';

const mapStateToProps = (state) => ({
  isVisible: getActiveModal(state) === EDIT_GOAL,
  goalNumberOfPages: getGoalNumberOfPages(state),
});

const mapDispatchToProps = (dispatch) => ({
  hideModal: () => dispatch(hideModal),
  updateGoal: (numberOfPages) => dispatch(updateGoal(numberOfPages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditGoalModal);
