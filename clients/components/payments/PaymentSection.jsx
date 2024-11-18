// PaymentSection
import React, { useState } from 'react';
import paymentService from '../utils/paymentApi';

const PaymentSection = ({ bookingId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    try {
      console.log('1. Starting payment process for booking:', bookingId);
      setLoading(true);
      setError(null);

      const response = await paymentService.initiatePayment(bookingId);
      console.log('2. Payment response received:', response);

      // Log the response structure
      console.log('3. Response check:', {
        hasResult: !!response?.result,
        hasLink: !!response?.result?.link,
        hasPaymentId: !!response?.result?.payment_id,
        fullResponse: response
      });

      if (!response?.result?.link) {
        console.error('4. Invalid response structure:', response);
        throw new Error('Invalid payment response from server');
      }

      // Store payment details
      console.log('5. Storing payment ID:', response.result.payment_id);
      localStorage.setItem('currentPaymentId', response.result.payment_id);

      // Redirect to payment page
      console.log('6. Redirecting to:', response.result.link);
      window.location.href = response.result.link;

    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-gray-600 mb-2">
        *If the work is completed satisfactorily, proceed with the payment.
      </p>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="text-sm">{error}</p>
          <p className="text-xs mt-1">Please try again or contact support if the problem persists.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;