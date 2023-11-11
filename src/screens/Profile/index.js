import { connect } from 'react-redux';
import { getUserEmail, getRegistered, getGooglePlayUrl, deriveIsTheLatestAppVersion } from '~redux/selectors/auth';
import { signOut } from '~redux/actions/authActions';
import { showModal } from '~redux/actions/booksActions';
import { LANGUAGE_SETTINGS } from '~constants/modalTypes';
import Profile from './Profile';

const mapStateToProps = (state) => ({
  email: getUserEmail(state),
  registered: getRegistered(state),
  googlePlayUrl: getGooglePlayUrl(state),
  isTheLatestAppVersion: deriveIsTheLatestAppVersion(state),
});

const mapDispatchToProps = (dispatch) => ({
  signOut: () => dispatch(signOut),
  showModal: () => dispatch(showModal(LANGUAGE_SETTINGS)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
