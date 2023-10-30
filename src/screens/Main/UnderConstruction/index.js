import { connect } from 'react-redux';
import { getUnderConstruction } from '~redux/selectors/app';
import UnderConstruction from './UnderConstruction';

const mapStateToProps = (state) => ({
  underConstruction: getUnderConstruction(state),
});

export default connect(mapStateToProps)(UnderConstruction);
