import React from 'react';
import { t } from '@lingui/macro';

import ErrorPage from './ErrorPage';
import { i18n } from '../App';


export const INotFoundPage = props => (
  <ErrorPage title={i18n._(t`Page not found. Are you sure the path is correct?`)} code="404" {...props} />
);

const NotFoundPage = INotFoundPage;
export default NotFoundPage;
