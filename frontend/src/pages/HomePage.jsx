import React, { useEffect } from 'react'
import { Container, VStack, Text, SimpleGrid } from "@chakra-ui/react"
import { Link } from 'react-router-dom'
import { useProductStore } from '../store/product'
import ProductCart from '../components/ProductCart'
const HomePage = () => {

  const { fetchProducts, products } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.categories || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  const categories = ['fruits', 'grains', 'vegetables', 'uncategorized'];

  return <Container maxW="container.xl" py={12}>
    <VStack spacing={12}>
      {categories.map((category) => (
        <VStack key={category} spacing={6} width="full" align="start">
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textTransform="capitalize"
            color={category === 'uncategorized' ? 'gray.500' : 'blue.500'}
          >
            {category === 'uncategorized' ? 'Other Products' : category}
          </Text>
          
          {productsByCategory[category]?.length > 0 ? (
            <SimpleGrid
              columns={{
                base: 1,
                md: 2,
                lg: 3
              }}
              spacing={10}
              width="full"
            >
              {productsByCategory[category].map((product) => (
                <ProductCart key={product._id} product={product} />
              ))}
            </SimpleGrid>
          ) : (
            <Text fontSize="md" color="gray.500">
              No {category} listed yet
            </Text>
          )}
        </VStack>
      ))}

      {products.length === 0 && (
        <Text fontSize={"xl"} textAlign={"center"} fontWeight={"bold"} color={"gray.500"}>
          No Products Listed! {" "}
          <Link to={"/create"}>
            <Text as='span' color={"blue.500"} fontWeight={"bold"} _hover={{ textDecoration: "underline" }}>
              Create new Product
            </Text>
          </Link>
        </Text>
      )}


    </VStack>

  </Container>
}

export default HomePage