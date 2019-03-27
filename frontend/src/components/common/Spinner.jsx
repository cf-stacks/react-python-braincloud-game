import React from 'react';

import '../../css/Spinner.css';

export const Spinner = () => (
  <div className="d-flex h-100 align-items-center justify-content-center">
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

export default Spinner;
