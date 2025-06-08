// src/pages/CreatePage.jsx
import {
    Box,
    Button,
    Container,
    Heading,
    Input,
    Select,
    useColorModeValue,
    VStack,
    useToast
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useProductStore } from '../store/product';
import { useAuthStore } from '../store/authStore'; 

const CreatePage = () => {
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: "",
        unit: "",
        image: "",
        categories: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useToast();
    const { createProduct } = useProductStore();
    const { user } = useAuthStore();

    const handleAddProduct = async () => {
        if (!user || !user._id) {
            toast({
                title: "Not Logged In",
                description: "You must be logged in as a seller to add products.",
                status: "error",
                isClosable: true
            });
            return;
        }
    
        // Validate only the fields that will be sent to the API
        if (!newProduct.name || !newProduct.price || !newProduct.categories) {
            toast({
                title: "Missing Information",
                description: "Please provide name, price, and category.",
                status: "error",
                isClosable: true
            });
            return;
        }
    
        setIsSubmitting(true);
    
        const productData = {
            name: newProduct.name,
            categories: newProduct.categories,
            price: parseFloat(newProduct.price),
            unit: newProduct.unit, // Add unit if your backend expects it
            image: newProduct.image, // Add image if your backend expects it
            farmer: user._id
        };
    
        console.log("Product data being sent:", productData);
    
        try {
            const { success, message } = await createProduct(productData);
    
            toast({
                title: success ? "Success" : "Error",
                description: message,
                status: success ? "success" : "error",
                isClosable: true
            });
    
            if (success) {
                setNewProduct({
                    name: "",
                    price: "",
                    unit: "",
                    image: "",
                    categories: ""
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred while creating the product.",
                status: "error",
                isClosable: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <Container maxW="md" py={10}>
            <VStack spacing={6}>
                <Heading as="h1" size="lg" textAlign="center">
                    Create New Product
                </Heading>
                <Box
                    w="full"
                    bg={useColorModeValue("white", "gray.800")}
                    rounded="lg"
                    p={6}
                    shadow="md"
                >
                    <VStack spacing={4}>
                        <Input
                            value={newProduct.name}
                            placeholder="Enter the product name"
                            name="name"
                            aria-label="Product Name"
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            isRequired
                        />

                        <Input
                            type="number"
                            value={newProduct.price}
                            placeholder="Enter the product price"
                            name="price"
                            aria-label="Product Price"
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            isRequired
                        />

                        <Input
                            value={newProduct.unit}
                            placeholder="Enter the product unit (e.g., kg)"
                            name="unit"
                            aria-label="Product Unit"
                            onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                        />

                        <Input
                            value={newProduct.image}
                            placeholder="Enter image URL"
                            name="image"
                            aria-label="Image URL"
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        />

                        <Select
                            placeholder="Select product category"
                            value={newProduct.categories}
                            aria-label="Product Category"
                            onChange={(e) => setNewProduct({ ...newProduct, categories: e.target.value })}
                            isRequired
                        >
                            <option value="fruits">Fruits</option>
                            <option value="grains">Grains</option>
                            <option value="vegetables">Vegetables</option>
                        </Select>

                        <Button
                            colorScheme="green"
                            bg="green.500"
                            color="white"
                            isLoading={isSubmitting}
                            onClick={handleAddProduct}
                            w="full"
                        >
                            Add Product
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Container>
    );
};

export default CreatePage;