import {
  Box,
  Card,
  Container,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Heading mt="6">Bonjour Corentin,</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} mt="6">
        <Card.Root>
          <Card.Header />
          <Card.Body />
          <Card.Footer />
        </Card.Root>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;
