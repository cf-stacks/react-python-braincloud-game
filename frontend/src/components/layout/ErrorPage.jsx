import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import styles from '../../css/ErrorPage.module.sass';

export const IErrorPage = ({ parent, title, code }) => (
  <React.Fragment>
    <div className={styles.errorpage}>
      <p className={styles.info}>{title}</p>
      <h1 className={styles.internal}>
        {code.split('').map((char, index) => {
          /* eslint-disable react/no-array-index-key */
          return (
            <span key={index} className={char === '0' ? styles.zero : null}>
              {char}
            </span>
          );
        })}
      </h1>
      <footer className={styles.link}>
        <Link to="/" onClick={() => (parent ? parent.setState({ hasError: false }) : null)}>
          <Trans>Go home</Trans>
        </Link>
      </footer>
    </div>
  </React.Fragment>
);

const ErrorPage = IErrorPage;
export default ErrorPage;
