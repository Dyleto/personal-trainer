import { useAuth } from '@/contexts/useAuth';
import {
  Box,
  VStack,
  Heading,
  Container,
  Text,
  Button,
} from '@chakra-ui/react';

const NoRole = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      as="main"
      id="contenu"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <Container centerContent py={12}>
        <VStack w="100%" maxW="380px">
          <VStack gap={1} textAlign="center">
            <Heading
              as="h1"
              fontSize="42px"
              fontWeight="800"
              letterSpacing="9px"
              style={{
                background:
                  'linear-gradient(180deg, #fff, rgba(255,255,255,0.72))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              KETTLE
            </Heading>
          </VStack>

          <VStack gap={2.5} w="100%" mt={8} textAlign="center">
            <Heading size="2xl" mb="8" as="h2">
              Votre compte est créé, mais vous n'avez pas encore l'accès à
              l'application.
            </Heading>

            <Text>
              Vous êtes{' '}
              <Text as="span" fontWeight="bold" color="app.primary">
                client
              </Text>{' '}
              ? Contactez votre coach.
            </Text>
            <Text>
              Vous êtes{' '}
              <Text as="span" fontWeight="bold" color="app.primary">
                coach
              </Text>{' '}
              ? Contactez un administrateur.
            </Text>
          </VStack>
          <VStack>
            <Button
              mt={8}
              size="xl"
              bg="fg"
              cursor="pointer"
              onClick={handleLogout}
              _hover={{ bg: 'app.primary' }}
            >
              Revenir à la connexion
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default NoRole;
