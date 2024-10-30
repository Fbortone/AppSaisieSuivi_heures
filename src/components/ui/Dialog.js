import React from 'react';

function Dialog({ open, children }) {
  return open ? <div>{children}</div> : null;
}

export default Dialog;


