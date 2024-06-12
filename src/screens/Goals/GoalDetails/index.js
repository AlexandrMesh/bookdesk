import { connect } from 'react-redux';
import { addGoalItem, getGoalItems, deleteUserGoalItem } from '~redux/actions/goalsActions';
import { deriveSectionedPagesDone, getGoalNumberOfPages, deriveNumberOfPagesDoneToday, deriveTodayProgress } from '~redux/selectors/goals';
import GoalDetails from './GoalDetails';

const mapStateToProps = (state) => ({
  sectionedPagesDone: deriveSectionedPagesDone(state),
  goalNumberOfPages: getGoalNumberOfPages(state),
  numberOfPagesDoneToday: deriveNumberOfPagesDoneToday(state),
  todayProgress: deriveTodayProgress(state),
});

const mapDispatchToProps = (dispatch) => ({
  getGoalItems: () => dispatch(getGoalItems()),
  addGoalItem: (pages) => dispatch(addGoalItem(pages)),
  deleteUserGoalItem: (id) => dispatch(deleteUserGoalItem(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalDetails);
