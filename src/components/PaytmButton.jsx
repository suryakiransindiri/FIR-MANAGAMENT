import React from 'react';

const PaytmButton = React.forwardRef(({ children, ...props }, ref) => (
  <button
    className="paytm-btn"
    ref={ref}
    {...props}
    aria-label={props['aria-label'] || (typeof children === 'string' ? children : undefined)}
  >
    {children}
  </button>
));

export default PaytmButton;
