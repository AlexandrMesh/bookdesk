import { connect } from 'react-redux';
import { addGoalItem, getGoalItems } from '~redux/actions/goalsActions';
import {
  getGoalsData,
  deriveSectionedPagesDone,
  getGoalNumberOfPages,
  deriveNumberOfPagesDoneToday,
  deriveTodayProgress,
} from '~redux/selectors/goals';
import GoalDetails from './GoalDetails';

const mapStateToProps = (state) => ({
  goalsDataLength: getGoalsData(state)?.length,
  sectionedPagesDone: deriveSectionedPagesDone(state),
  goalNumberOfPages: getGoalNumberOfPages(state),
  numberOfPagesDoneToday: deriveNumberOfPagesDoneToday(state),
  todayProgress: deriveTodayProgress(state),
});

const mapDispatchToProps = (dispatch) => ({
  getGoalItems: () => dispatch(getGoalItems()),
  addGoalItem: (pages) => dispatch(addGoalItem(pages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalDetails);
