import { connect } from 'react-redux';
import { checkAuth } from '~redux/actions/authActions';
import { checkUnderConstruction } from '~redux/actions/appActions';
import { getCheckingStatus, getIsSignedIn, deriveIsTheLatestAppVersion } from '~redux/selectors/auth';
import { getGoalNumberOfPages } from '~redux/selectors/goals';
import { getLoadingUnderConstructionStatus, getUnderConstruction } from '~redux/selectors/app';
import { getNewCustomBookNameValue } from '~redux/selectors/customBook';
import Main from './Main';

const mapStateToProps = (state) => ({
  checkingStatus: getCheckingStatus(state),
  loadingUnderConstructionStatus: getLoadingUnderConstructionStatus(state),
  hasGoal: !!getGoalNumberOfPages(state),
  isSignedIn: getIsSignedIn(state),
  isTheLatestAppVersion: deriveIsTheLatestAppVersion(state),
  underConstruction: getUnderConstruction(state),
  customBookName: getNewCustomBookNameValue(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkAuth: (token) => dispatch(checkAuth(token)),
  checkUnderConstruction: () => dispatch(checkUnderConstruction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
