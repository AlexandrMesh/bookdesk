import { connect } from 'react-redux';
import { getUserEmail, getRegistered } from '~redux/selectors/auth';
import { signOut } from '~redux/actions/authActions';
import Profile from './Profile';

const mapStateToProps = (state) => ({
  email: getUserEmail(state),
  registered: getRegistered(state),
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
