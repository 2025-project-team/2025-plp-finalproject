// Place in client/src/components/PaymentButton.jsx
import React from 'react';

const PaymentButton = () => {
  const handlePayment = async () => {
    const res = await fetch('/api/payment/create-checkout-session', { method: 'POST' });
    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <button onClick={handlePayment} className="btn btn-primary">
      Upgrade to Premium
    </button>
  );
};

export default PaymentButton;