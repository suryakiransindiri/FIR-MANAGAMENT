import React from 'react';

const PaytmInput = React.forwardRef(({ type = 'text', ...props }, ref) => (
  <input
    type={type}
    className="paytm-input"
    ref={ref}
    aria-label={props.placeholder || props.name}
    {...props}
  />
));

export default PaytmInput;
