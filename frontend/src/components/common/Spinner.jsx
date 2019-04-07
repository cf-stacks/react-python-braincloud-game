import React from 'react';

import '../../css/Spinner.css';

export const ISpinner = ({ message = null }) => (
  <div className="d-flex h-200 flex-column align-items-center justify-content-center">
    <div className="lead">{message}</div>
    <div className="my-auto">
      <div className="lds-ellipsis">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);

const Spinner = ISpinner;
export default Spinner;
