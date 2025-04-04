import React, { useState } from 'react'
import { EditIcon, DeleteIcon } from "@chakra-ui/icons"
import { FaCartPlus } from "react-icons/fa";
import { useProductStore } from '../store/product';
import { Flex, useToast } from '@chakra-ui/react'
import { useDisclosure } from "@chakra-ui/react";
import { useAuthStore } from '../store/authStore';
import { Navigate, useNavigate } from 'react-router-dom';
import {
    Box,
    Heading,
    HStack, VStack,
    IconButton,
    Image, Input, Button,
    Text,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter
} from '@chakra-ui/react'

import { useCartStore } from '../store/cart';


const ProductCart = ({ product }) => {
    const textColor = useColorModeValue("gray.600", "gray.200");
    const bg = useColorModeValue("white", "gray.800");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { deleteProducts, updateProducts } = useProductStore();
     const toast = useToast();
    const navigate = useNavigate();
    //states of this component
    const [quantity, setquantity] = useState(1)
    const [updatedProduct, setUpdatedProduct] = useState(product);
    const { user } = useAuthStore();
    const{addToCart,error} = useCartStore();


    //event handler of this function
    const handleUpdateProduct = async (pid, updatedProduct) => {
        const { success, message } = await updateProducts(pid, updatedProduct);
        onClose();
        if (success) {
            toast({
                title: "Updated Successfully!",
                description: message,
                status: "success",
                duration: 3000,
                isClosable: true
            })
        } else {
            toast({
                title: "Please provide proper details",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true
            })
        }

    }

    const handleDeleteProduct = async (pid) => {
        const { success, message } = await deleteProducts(pid);

        if (!success) {
            toast({
                title: "error  in deleteing the product",
                description: message,
                status: "error",
                duration: 3000,
                isClosable: true
            })
        } else {
            toast({
                title: "success!",
                description: message,
                status: "success",
                isClosable: true,
                duration: 3000
            })
        }
    }


    //add to cart handler
    const handleAddtoCart = async (pid) => {

        if (quantity <= 0) {
            return toast({
                title: "Invalid Quantity",
                description: "Please select a valid quantity",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }

       const {success,message} = await addToCart(user._id,pid, quantity,product.price,product.image);
       if(success){
        toast({
            title: "Product Added to Cart",
            description: message,
            status: "success",
            duration: 3000,
            isClosable: true
            })
       }
       else{
        toast({
            title: error,
            description:message,
            status: "error",
            duration: 3000,
            isClosable: true
        })
       }
      };
      

    const handleMinus = () => {
        setquantity(quantity > 0 ? quantity - 1 : 0);
    };

    const handlePlus = () => {
        setquantity(quantity + 1);
    };

    const handleBuy = () =>{
        navigate("/billing")
    }

    return <Box
        shadow="lg"
        rounded="lg"
        overflow="hidden"
        transition="all 0.3s"
        _hover={{ transform: "translateY(-5px)", shadow: "xl" }}
        bg={bg}>
        <Image
            src={product.image} alt={product.name} h={48} w={"full"} objectFit={"cover"} />

        <Box p={4}>
            <Heading as={"h3"} size={"md"} mb={2}>
                {product.name}
            </Heading>

            <Text fontWeight={"bold"} fontSize={"xl"} color={textColor} mb={4}>
                ₹ {product.price}/{product.unit}
            </Text>
            {user.accountType == "seller" ? <><HStack spacing={2}>
                <IconButton icon={<EditIcon />} onClick={onOpen} colorScheme='blue' />
                <IconButton icon={<DeleteIcon />} onClick={() => handleDeleteProduct(product._id)} colorScheme='red' />
            </HStack>
                <>
                </>
            </> : <>
                <Button style={{ marginRight: "10px" }} onClick={handleBuy}>Buy Now</Button>
                <IconButton icon={<FaCartPlus />} onClick={() => handleAddtoCart(product._id)} colorScheme='red' />

                <Box display={"Flex"} marginTop={"5px"}>
                    <Button onClick={handleMinus} fontWeight={"800"} >-</Button>
                    <Input
                        value={quantity}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\.?\d*$/.test(value)) {
                                setquantity(value); // Keep as a string to allow intermediate values like "10."
                            }
                        }}
                        onBlur={() => setquantity(parseFloat(quantity) || 0)} // Convert to number on blur
                        w="80px"
                        textAlign="center"
                    />

                    <Button onClick={handlePlus} fontWeight={"800"}>+</Button>
                </Box>


            </>}
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    Update the details of product
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <Input placeholder='Enter the product name' type="text" name='name' value={updatedProduct.name}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })} />

                        <Input placeholder='Enter the product price' type='number' name='price' value={updatedProduct.price}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })} />

                        <Input placeholder='Enter the Unit of product' type='text' name='unit' value={updatedProduct.unit}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, unit: e.target.value })} />

                        <Input placeholder='Enter image URL' name='image' type='text' value={updatedProduct.image}
                            onChange={(e) => setUpdatedProduct({ ...updatedProduct, image: e.target.value })} />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={() => handleUpdateProduct(product._id, updatedProduct)}>Update</Button>
                    <Button variant={"ghost"} onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </Box>
}

export default ProductCart


// const handleAddtoCart = async (pid) => {
//     if (quantity <= 0) {
//         return toast({
//           title: "Invalid Quantity",
//           description: "Please select a valid quantity",
//           status: "error",
//           duration: 3000,
//           isClosable: true
//         });
//       }
//     try {
//       const response = await fetch('http://localhost:5000/api/cart/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           userId: user._id, // Assuming `user` contains the logged-in user's ID
//           productId: pid,
//           quantity,
//           price: product.price
//         }),
//         credentials: 'include', 
//       });
  
//       const result = await response.json();
//   console.log("result is: ",result)
//       if (result.success) {
//         toast({
//           title: "Added to Cart!",
//           description: result.message,
//           status: "success",
//           duration: 3000,
//           isClosable: true
//         });
//       } else {
//         toast({
//           title: "Error",
//           description: result.message,
//           status: "error",
//           duration: 3000,
//           isClosable: true
//         });
//       }
//     } catch (error) {
//       console.error("Error adding product to cart:", error);
//       toast({
//         title: "Error",
//         description: "Failed to add product to cart",
//         status: "error",
//         duration: 3000,
//         isClosable: true
//       });
//     }
//   };