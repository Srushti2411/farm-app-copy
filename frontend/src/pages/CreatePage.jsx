import { Box, Button, Container, Heading, Input, useColorModeValue, VStack } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useProductStore } from '../store/product';
import { useToast } from '@chakra-ui/react'

const CreatePage = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "",
    unit:""
  });
const toast= useToast();
  const {createProduct} = useProductStore();

  const handleAddProduct = async() =>{
    const {success,message}= await createProduct(newProduct);
    if(!success){
      toast({
          title: "Error",
          description:message,
          status:"error",
          isClosable:true
        });
    }else{
      toast({
        title:"Success",
        description:message,
        status:"success",
        isClosable:true
      })
    }
  }

  return <Container>
    <VStack>
      <Heading as={"h1"} textAlign={"center"} mb={8}>
        Create new Products
      </Heading>
      <Box
        w={"full"} bg={useColorModeValue("white", "gray.800")}
        rounded={"lg"} p={6} shadow={"md"}>
        <VStack>
          <Input value={newProduct.name} placeholder='Enter the product name' name='name'
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />

          <Input value={newProduct.price} placeholder='Enter the product price' name='price'
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />

          <Input value={newProduct.unit} placeholder='Enter the product unit' name='unit'
            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })} />

          <Input value={newProduct.image} placeholder='Enter image URL' name='image'
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
          
            <Button colorScheme='blue' onClick={handleAddProduct} w={"full"}>Add Product</Button>
        </VStack>
      </Box>
    </VStack>
  </Container>
}

export default CreatePage