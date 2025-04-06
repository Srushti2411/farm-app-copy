import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const Payment = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Heading size="xl" color="gray.800">Payment Page</Heading>
      <Text mt={4} fontSize="lg" color="gray.600">
        Integrate your payment gateway here (Razorpay, Stripe, etc.)
      </Text>
    </Box>
  );
};

export default Payment;
