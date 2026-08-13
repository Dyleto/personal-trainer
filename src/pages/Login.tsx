import {
  Box,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAuth } from '@/contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useThemeColors } from '@/hooks/useThemeColors';

const Login: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const colors = useThemeColors();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/');
    }
  }, [isLoading, user, navigate]);

  if (isLoading) return <Spinner />;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <Container centerContent py={20}>
        <VStack gap={16} w="100%" maxW="md">
          {/* Header */}
          <VStack gap={4} textAlign="center">
            <Heading
              size="7xl"
              fontWeight="bold"
              letterSpacing="10px"
              style={{
                background:
                  'linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.72))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              KETTLE
            </Heading>

            <Box
              h="1px"
              w="50vw"
              maxW="300px"
              style={{
                background: `linear-gradient(to right, transparent, ${colors.primaryHex}, transparent)`,
              }}
            />

            <Text color="fg.muted" fontSize="md">
              Votre application de coaching personnel
            </Text>
          </VStack>

          {/* Bouton Google stylisé */}
          <GoogleLoginButton text="Continuer avec Google" />
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
