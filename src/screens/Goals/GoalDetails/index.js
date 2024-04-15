import { connect } from 'react-redux';
import { addGoalItem } from '~redux/actions/goalsActions';
import {
  getGoalsData,
  deriveSectionedPagesDone,
  getGoalNumberOfPages,
  deriveNumberOfPagesDoneToday,
  deriveTodayProgress,
} from '~redux/selectors/goals';
import { showModal } from '~redux/actions/booksActions';
import { EDIT_GOAL } from '~constants/modalTypes';
import GoalDetails from './GoalDetails';

const mapStateToProps = (state) => ({
  goalsData: getGoalsData(state),
  sectionedPagesDone: deriveSectionedPagesDone(state),
  goalNumberOfPages: getGoalNumberOfPages(state),
  numberOfPagesDoneToday: deriveNumberOfPagesDoneToday(state),
  todayProgress: deriveTodayProgress(state),
});

const mapDispatchToProps = (dispatch) => ({
  addGoalItem: (item) => dispatch(addGoalItem(item)),
  showEditGoalModal: () => dispatch(showModal(EDIT_GOAL)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalDetails);
