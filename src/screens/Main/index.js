import { connect } from 'react-redux';
import { checkAuth, getConfig } from '~redux/actions/authActions';
import { getCheckingStatus, getIsSignedIn, deriveIsTheLatestAppVersion } from '~redux/selectors/auth';
import { getGoalNumberOfPages } from '~redux/selectors/goals';
import { getNewCustomBookNameValue } from '~redux/selectors/customBook';
import Main from './Main';

const mapStateToProps = (state) => ({
  checkingStatus: getCheckingStatus(state),
  hasGoal: !!getGoalNumberOfPages(state),
  isSignedIn: getIsSignedIn(state),
  isTheLatestAppVersion: deriveIsTheLatestAppVersion(state),
  customBookName: getNewCustomBookNameValue(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkAuth: (token) => dispatch(checkAuth(token)),
  getConfig: (url) => dispatch(getConfig(url)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
