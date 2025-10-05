import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Strong,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Heading mt="6" ml="10">
        Bonjour Corentin,
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} mt="6" gap="4">
        <Card.Root width="320px" bg="bg.inverted" color="fg.inverted">
          <Card.Header>
            <Heading fontWeight="semibold">Séance Jambes</Heading>
            <Text color="fg.subtle" textStyle="sm">
              Jeu. 20/05
            </Text>
          </Card.Header>
          <HStack mt="5" gap="0">
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderRight="1px solid"
                borderTopEndRadius="0"
                borderBottomEndRadius="0"
              >
                Ressentis
              </Button>
            </Stack>
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderTopStartRadius="0"
                borderBottomStartRadius="0"
              >
                Retours
              </Button>
            </Stack>
          </HStack>
        </Card.Root>
        <Card.Root width="320px" bg="bg.inverted" color="fg.inverted">
          <Card.Header>
            <Heading fontWeight="semibold">Séance Jambes</Heading>
            <Text color="fg.subtle" textStyle="sm">
              Jeu. 20/05
            </Text>
          </Card.Header>
          <HStack mt="5" gap="0">
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderRight="1px solid"
                borderTopEndRadius="0"
                borderBottomEndRadius="0"
              >
                Ressentis
              </Button>
            </Stack>
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderTopStartRadius="0"
                borderBottomStartRadius="0"
              >
                Retours
              </Button>
            </Stack>
          </HStack>
        </Card.Root>
        <Card.Root width="320px" bg="bg.inverted" color="fg.inverted">
          <Card.Header>
            <Heading fontWeight="semibold">Séance Jambes</Heading>
            <Text color="fg.subtle" textStyle="sm">
              Jeu. 20/05
            </Text>
          </Card.Header>
          <HStack mt="5" gap="0">
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderRight="1px solid"
                borderTopEndRadius="0"
                borderBottomEndRadius="0"
              >
                Ressentis
              </Button>
            </Stack>
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderTopStartRadius="0"
                borderBottomStartRadius="0"
              >
                Retours
              </Button>
            </Stack>
          </HStack>
        </Card.Root>
        <Card.Root width="320px" bg="bg.inverted" color="fg.inverted">
          <Card.Header>
            <Heading fontWeight="semibold">Séance Jambes</Heading>
            <Text color="fg.subtle" textStyle="sm">
              Jeu. 20/05
            </Text>
          </Card.Header>
          <HStack mt="5" gap="0">
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderRight="1px solid"
                borderTopEndRadius="0"
                borderBottomEndRadius="0"
              >
                Ressenti
              </Button>
            </Stack>
            <Stack w="100%" textAlign="center">
              <Button
                variant="outline"
                bg="yellow.400"
                color="fg.inverted"
                border="none"
                borderTopStartRadius="0"
                borderBottomStartRadius="0"
              >
                Retour
              </Button>
            </Stack>
          </HStack>
        </Card.Root>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;
