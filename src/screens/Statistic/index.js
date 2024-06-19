import { connect } from 'react-redux';
import { loadStat } from '~redux/actions/statisticActions';
import { getShouldReloadStat } from '~redux/selectors/statistic';
import { COMPLETED } from '~constants/boardType';
import Statistic from './Statistic';

const mapStateToProps = (state) => ({
  shouldReloadStat: getShouldReloadStat(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadStat: () => dispatch(loadStat(COMPLETED)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistic);
