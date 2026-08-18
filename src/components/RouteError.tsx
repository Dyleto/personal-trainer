import { useRouteError } from 'react-router-dom';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';

export function RouteError() {
  const error = useRouteError();
  console.error('Route error:', error);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={4}
    >
      <VStack gap={6}>
        <Heading size="xl">Oups ! Quelque chose s'est cassé.</Heading>
        <Text color="fg.muted" maxW="md">
          Une erreur inattendue s'est produite (peut-être un problème de
          connexion internet qui a empêché le chargement de la page).
        </Text>
        <Button
          onClick={() => window.location.reload()}
          bg="app.primary"
          color="bg.canvas"
          _hover={{ bg: 'app.primary.hover' }}
          size="lg"
        >
          Recharger la page
        </Button>
      </VStack>
    </Box>
  );
}
