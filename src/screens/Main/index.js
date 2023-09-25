import { connect } from 'react-redux';
import { checkAuth } from '~redux/actions/authActions';
import { getCheckingStatus, getIsSignedIn } from '~redux/selectors/auth';
import Main from './Main';

const mapStateToProps = (state) => ({
  checkingStatus: getCheckingStatus(state),
  isSignedIn: getIsSignedIn(state),
});

const mapDispatchToProps = (dispatch) => ({
  checkAuth: (token) => dispatch(checkAuth(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
