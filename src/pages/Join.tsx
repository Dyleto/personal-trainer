import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useVerifyInviteToken } from '@/features/auth';
import {
  Avatar,
  Box,
  Container,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Join = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invitationToken = searchParams.get('token') ?? undefined;

  const { data, isLoading, error } = useVerifyInviteToken(invitationToken);

  useEffect(() => {
    if (!invitationToken) {
      navigate('/login', { replace: true });
    }
  }, [invitationToken, navigate]);

  const coachName = data?.coach
    ? `${data.coach.firstName} ${data.coach.lastName}`
    : '';

  const getContent = () => {
    if (isLoading) {
      return (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          minH="40vh"
        >
          <Spinner size="xl" color="app.primary" />
        </Box>
      );
    }

    if (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined;

      if (status === 410) {
        return (
          <VStack gap={3} w="100%">
            <Avatar.Root
              size="2xl"
              mb={2}
              opacity={0.6}
              style={{ filter: 'grayscale(100%)' }}
            >
              <Avatar.Fallback name={coachName} />
              <Avatar.Image src={data?.coach.picture} />
            </Avatar.Root>
            <Heading
              fontSize="24px"
              fontWeight="800"
              textAlign="center"
              maxW="20ch"
            >
              Lien d'invitation expiré
            </Heading>
            <Text color="fg.muted" fontSize="sm" textAlign="center" maxW="30ch">
              Ce lien n'est plus valide. Demandez à votre coach de vous en
              envoyer un nouveau.
            </Text>
          </VStack>
        );
      }

      return (
        <VStack gap={3} w="100%">
          <Box fontSize="26px" color="app.error" mb={1}>
            ⊘
          </Box>
          <Heading
            fontSize="24px"
            fontWeight="800"
            textAlign="center"
            maxW="20ch"
          >
            Lien d'invitation invalide
          </Heading>
          <Text color="fg.muted" fontSize="sm" textAlign="center" maxW="30ch">
            Le lien que vous avez ouvert n'existe pas ou est incorrect.
            Vérifiez-le auprès de votre coach.
          </Text>
        </VStack>
      );
    }

    return (
      <VStack gap={3} w="100%">
        <Avatar.Root size="2xl" mb={2}>
          <Avatar.Fallback name={coachName} />
          <Avatar.Image src={data?.coach.picture} />
        </Avatar.Root>
        <Text
          fontSize="11px"
          letterSpacing="1.5px"
          textTransform="uppercase"
          fontWeight="800"
          color="app.primary"
        >
          Invitation coaching
        </Text>
        <Heading
          fontSize="24px"
          fontWeight="800"
          textAlign="center"
          lineHeight="1.25"
          maxW="22ch"
        >
          {coachName}
          <br />
          <Box as="span" color="app.primary">
            vous invite
          </Box>{' '}
          à le rejoindre
        </Heading>
        <Text
          color="fg.muted"
          fontSize="sm"
          textAlign="center"
          maxW="30ch"
          mb={2}
        >
          Créez votre compte pour accéder à votre programme personnalisé et
          suivre vos séances.
        </Text>
        <GoogleLoginButton
          text="Rejoindre avec Google"
          invitationToken={invitationToken}
        />
      </VStack>
    );
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <Container centerContent py={12}>
        <VStack gap={7} w="100%" maxW="380px">
          <Text
            fontSize="13px"
            fontWeight="800"
            letterSpacing="4px"
            color="fg.muted"
          >
            KETTLE
          </Text>

          {getContent()}

          {!isLoading && !error && (
            <Text fontSize="xs" color="fg.muted" textAlign="center" maxW="32ch">
              Vous serez automatiquement rattaché à {coachName} — aucun autre
              compte à créer.
            </Text>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Join;
