import { oneOf } from 'prop-types';
import { IDLE, PENDING, REFRESHING, SUCCEEDED, FAILED } from '~constants/loadingStatuses';

export default oneOf([IDLE, PENDING, REFRESHING, SUCCEEDED, FAILED]);
