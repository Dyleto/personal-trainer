import { Session } from '@/types';
import { buildGuidedSteps } from '../guidedSteps';
import { Box, HStack, Button, VStack, Text } from '@chakra-ui/react';
import { useState } from 'react';

interface GuidedSessionProps {
  session: Session;
  onExit: () => void;
  onFinish: () => void;
}

export const GuidedSession = ({
  session,
  onExit,
  onFinish,
}: GuidedSessionProps) => {
  const [steps] = useState(() => buildGuidedSteps(session));
  const [index, setIndex] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  const goNext = () => {
    if (isLast) {
      onFinish();
      return;
    }
    setIndex((i) => i + 1);
  };

  const goPrev = () => setIndex((i) => Math.max(0, i - 1));

  const handleExitClick = () => {
    if (index > 0) {
      setShowExitConfirm(true);
    } else {
      onExit();
    }
  };

  if (steps.length === 0) {
    return (
      <Box
        position="fixed"
        inset={0}
        zIndex={50}
        bg="bg.canvas"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={8}
        gap={4}
        textAlign="center"
      >
        <Text fontSize="lg" fontWeight="bold">
          Aucun exercice à suivre
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Cette séance n'a pas d'exercices définis.
        </Text>
        <Button
          bg="app.primary"
          color="bg.canvas"
          fontWeight="bold"
          onClick={onExit}
        >
          Retour
        </Button>
      </Box>
    );
  }

  if (showExitConfirm) {
    return (
      <Box
        position="fixed"
        inset={0}
        zIndex={50}
        bg="bg.canvas"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={8}
        gap={6}
        textAlign="center"
      >
        <Text fontSize="lg" fontWeight="bold">
          Quitter le mode guidé ?
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Ta progression sur cette séance ne sera pas enregistrée.
        </Text>
        <VStack gap={2} w="full" maxW="280px">
          <Button
            w="full"
            bg="app.primary"
            color="bg.canvas"
            fontWeight="bold"
            onClick={onExit}
          >
            Quitter
          </Button>
          <Button
            w="full"
            variant="ghost"
            color="fg.muted"
            onClick={() => setShowExitConfirm(false)}
          >
            Continuer la séance
          </Button>
        </VStack>
      </Box>
    );
  }

  const isRest = step.type === 'rest';

  const dotColor = (i: number) => {
    if (isRest) {
      return i <= index ? 'bg.canvas' : 'bg.canvas/25';
    }
    if (i < index) return 'session.rest';
    if (i === index) return 'app.primary';
    return 'whiteAlpha.200';
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={50}
      bg={{ base: isRest ? 'session.rest' : 'bg.canvas', md: 'blackAlpha.800' }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={{ base: 'stretch', md: 'center' }}
    >
      <Box
        w="full"
        maxW={{ base: 'full', md: '560px' }}
        h={{ base: 'full', md: '90vh' }}
        maxH={{ base: 'full', md: '720px' }}
        bg={isRest ? 'session.rest' : 'bg.canvas'}
        borderRadius={{ base: 0, md: '2xl' }}
        boxShadow={{ md: '0 24px 64px rgba(0,0,0,0.5)' }}
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
        <HStack justify="flex-end" p={4}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExitClick}
            color={isRest ? 'bg.canvas' : 'fg.muted'}
          >
            Quitter
          </Button>
        </HStack>

        <HStack gap="4px" px={5} pt={2}>
          {steps.map((_, i) => (
            <Box
              key={i}
              flex={1}
              h="3px"
              borderRadius="full"
              bg={dotColor(i)}
            />
          ))}
        </HStack>

        <VStack
          flex={1}
          justify="center"
          align="center"
          gap={6}
          px={8}
          textAlign="center"
        >
          {step.type === 'exercise' ? (
            <>
              <Text
                fontSize="xs"
                letterSpacing="2px"
                textTransform="uppercase"
                fontWeight="800"
                color="session.work"
              >
                {step.blockLabel}
              </Text>
              <Text fontSize="28px" fontWeight="800" maxW="22ch">
                {step.exerciseName}
              </Text>
              <Text
                fontSize="72px"
                fontWeight="800"
                fontFamily="mono"
                lineHeight="1"
              >
                {step.metric || '—'}
              </Text>
            </>
          ) : (
            <>
              <Text
                fontSize="xs"
                letterSpacing="2px"
                textTransform="uppercase"
                fontWeight="800"
                color="bg.canvas"
              >
                Repos
              </Text>
              <Text
                fontSize="72px"
                fontWeight="800"
                fontFamily="mono"
                lineHeight="1"
                color="bg.canvas"
              >
                {step.duration}s
              </Text>
              {step.nextExerciseName && (
                <Text fontSize="sm" color="bg.canvas" opacity={0.75}>
                  Ensuite : {step.nextExerciseName}
                </Text>
              )}
            </>
          )}
        </VStack>

        <HStack p={4} gap={3}>
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={index === 0}
            flexShrink={0}
            color={isRest ? 'bg.canvas' : 'fg.muted'}
          >
            Précédent
          </Button>
          <Button
            flex={1}
            bg={isRest ? 'bg.canvas' : 'app.primary'}
            color={isRest ? 'fg' : 'bg.canvas'}
            _hover={{ bg: isRest ? 'bg.canvas' : 'app.primary.hover' }}
            onClick={goNext}
          >
            {isLast ? 'Terminer' : step.type === 'rest' ? 'Passer' : 'Suivant'}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
