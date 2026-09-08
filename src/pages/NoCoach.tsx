import {
  Box,
  VStack,
  Heading,
  Container,
  Text,
  HStack,
} from '@chakra-ui/react';

const NoCoach = () => {
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
        <VStack gap={7} w="100%" maxW="380px">
          {/* Header */}
          <VStack gap={1} textAlign="center">
            <Heading
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

          {/* Fonctionnalités */}
          <VStack gap={2.5} w="100%" mt={8} textAlign="center">
            <Heading size="2xl" mb="8">
              Ton compte est créé, mais tu n'as pas encore l'accès à
              l'application.
            </Heading>

            <HStack gap={0}>
              Si tu es{' '}
              <Text fontWeight="bold" color="app.primary" ml={1}>
                client
              </Text>
              , contacte ton coach.
            </HStack>
            <HStack gap={0}>
              Si tu es{' '}
              <Text fontWeight="bold" color="app.primary" ml={1}>
                coach
              </Text>
              , contacte un administrateur.
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default NoCoach;
