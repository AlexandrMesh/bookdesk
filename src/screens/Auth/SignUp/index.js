import { connect } from 'react-redux';
import { signUp, setSignUpError, clearSignUpErrors } from '~redux/actions/authActions';
import { getSignUpLoadingDataStatus, getSignUpErrors } from '~redux/selectors/auth';
import SignUp from './SignUp';

const mapStateToProps = (state) => ({
  loadingDataStatus: getSignUpLoadingDataStatus(state),
  errors: getSignUpErrors(state),
});

const mapDispatchToProps = (dispatch) => ({
  signUp: (params) => dispatch(signUp(params)),
  setSignUpError: (fieldName, error) => dispatch(setSignUpError(fieldName, error)),
  clearErrors: () => dispatch(clearSignUpErrors),
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
