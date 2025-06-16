import React from 'react';

const PaytmCard = ({ children, style, role = 'region', ...props }) => (
  <div className="paytm-card" style={style} role={role} tabIndex={0} {...props}>
    {children}
  </div>
);

export default PaytmCard;
