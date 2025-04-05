import {
  Container, Box, Heading, VStack, Input, useColorModeValue, Button
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for routing

const BillingAddress = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    pin: '',
    address: '',
    city: '',
    district: '',
    state: ''
  });

  const navigate = useNavigate(); // used for redirecting

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceed = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      console.log(data.message); // Optional: log response message

      // Navigate to payment page
      navigate('/payment');
    } catch (err) {
      console.error("Error submitting billing:", err);
    }
  };

  return (
    <Container>
      <Heading mt={5} textAlign={"center"}>Fill your Details</Heading>
      <Box w={"full"} bg={useColorModeValue("white", "gray.800")}
        rounded={"lg"} p={6} shadow={"md"} mt={"20"}>
        <VStack>
          <Input placeholder='Enter Your name' name="name" onChange={handleChange} value={formData.name} marginBottom={"15px"} />
          <Input placeholder='Enter Your contact Number' name="contact" onChange={handleChange} value={formData.contact} marginBottom={"15px"} />
          <Input placeholder='Pin Code' name="pin" onChange={handleChange} value={formData.pin} marginBottom={"15px"} />
          <Input placeholder='Enter Your full address' name="address" onChange={handleChange} value={formData.address} marginBottom={"15px"} />
          <Input placeholder='City' name="city" onChange={handleChange} value={formData.city} marginBottom={"15px"} />
          <Input placeholder='District' name="district" onChange={handleChange} value={formData.district} marginBottom={"15px"} />
          <Input placeholder='State' name="state" onChange={handleChange} value={formData.state} marginBottom={"15px"} />
          <Button onClick={handleProceed}>Proceed for Payment</Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default BillingAddress;
