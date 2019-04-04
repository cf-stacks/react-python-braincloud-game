import React from 'react';
import { t } from '@lingui/macro';

import ErrorPage from './ErrorPage';
import { i18n } from '../App';


export const IForbiddenPage = props => (
  <ErrorPage title={i18n._(t`You do not have access to this page`)} code="403" {...props} />
);

const ForbiddenPage = IForbiddenPage;
export default ForbiddenPage;
