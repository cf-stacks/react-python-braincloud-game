import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Trans } from '@lingui/macro';

import styles from '../../css/GameApp.module.sass';

export const IGameApp = ({ user }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
    <div>
      <p className={styles.info}>
        {user ? <Trans key="1">{`Welcome, ${user.name}!`}</Trans> : null}
      </p>
      <p className={styles.info}>
        <Trans key="2">Soon games will be here...</Trans>
      </p>
    </div>
  </div>
);

IGameApp.propTypes = {
  user: PropTypes.shape({
    date_joined: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
    id: PropTypes.string.isRequired,
    is_active: PropTypes.bool.isRequired,
    is_staff: PropTypes.bool.isRequired,
    is_superuser: PropTypes.bool.isRequired,
    last_login: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    subordinates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }),
    ),
  }),
};

IGameApp.defaultProps = {
  user: null,
};

const mapStateTpProps = state => ({
  user: state.auth.user,
});

const GameApp = connect(mapStateTpProps)(IGameApp);
export default GameApp;
