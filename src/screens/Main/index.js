import { connect } from 'react-redux';
import { checkAuth } from '~redux/actions/authActions';
import { checkUnderConstruction } from '~redux/actions/appActions';
import { getCheckingStatus, getIsSignedIn, deriveIsTheLatestAppVersion } from '~redux/selectors/auth';
import { getLoadingUnderConstructionStatus, getUnderConstruction } from '~redux/selectors/app';
import Main from './Main';

const mapStateToProps = (state) => ({
  checkingStatus: getCheckingStatus(state),
  loadingUnderConstructionStatus: getLoadingUnderConstructionStatus(state),
  hasGoal: false,
  isSignedIn: getIsSignedIn(state),
  isTheLatestAppVersion: deriveIsTheLatestAppVersion(state),
  underConstruction: getUnderConstruction(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkAuth: (token) => dispatch(checkAuth(token)),
  checkUnderConstruction: () => dispatch(checkUnderConstruction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
