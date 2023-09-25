import { connect } from 'react-redux';
import { getAppVersion, getAppName, getAppDescription, getAppEmail, getLoadingDataStatus } from '~redux/selectors/app';
import { loadAppInfo, clearAppInfo } from '~redux/actions/appActions';
import About from './About';

const mapStateToProps = (state) => ({
  version: getAppVersion(state),
  name: getAppName(state),
  description: getAppDescription(state),
  email: getAppEmail(state),
  loadingDataStatus: getLoadingDataStatus(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadAppInfo: () => dispatch(loadAppInfo()),
  clearAppInfo: () => dispatch(clearAppInfo),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
