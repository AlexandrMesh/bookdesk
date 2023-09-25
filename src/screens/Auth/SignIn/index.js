import { connect } from 'react-redux';
import { getSignInLoadingDataStatus, getSignInErrors } from '~redux/selectors/auth';
import { signIn, setSignInError, clearSignInErrors } from '~redux/actions/authActions';
import SignIn from './SignIn';

const mapStateToProps = (state) => ({
  loadingDataStatus: getSignInLoadingDataStatus(state),
  errors: getSignInErrors(state),
});

const mapDispatchToProps = (dispatch) => ({
  signIn: (params) => dispatch(signIn(params)),
  setSignInError: (fieldName, error) => dispatch(setSignInError(fieldName, error)),
  clearErrors: () => dispatch(clearSignInErrors),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
