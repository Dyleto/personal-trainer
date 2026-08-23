import {
  Box,
  HStack,
  Text,
  VStack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { LuPlus } from 'react-icons/lu';
import { Session } from '@/types';

interface SessionRailProps {
  sessions: Session[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAddSession: () => void;
}

export const SessionRail = ({
  sessions,
  activeIndex,
  onSelect,
  onAddSession,
}: SessionRailProps) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  if (isDesktop) {
    return (
      <VStack align="stretch" gap={1} w="200px" flexShrink={0}>
        {sessions.map((session, index) => {
          const isActive = index === activeIndex;
          return (
            <Box
              key={session._id}
              as="button"
              onClick={() => onSelect(index)}
              textAlign="left"
              px={3}
              py={2}
              borderRadius="md"
              borderLeftWidth="2px"
              borderLeftColor={isActive ? 'app.primary' : 'transparent'}
              bg={isActive ? 'whiteAlpha.100' : 'transparent'}
              _hover={{ bg: 'whiteAlpha.50' }}
              transition="background 0.15s"
            >
              <Text
                fontSize="sm"
                fontWeight="bold"
                color={isActive ? 'fg' : 'fg.muted'}
              >
                Séance {session.order}
              </Text>
              <Text fontSize="xs" color="fg.muted">
                {session.blocks.length} bloc
                {session.blocks.length > 1 ? 's' : ''}
              </Text>
            </Box>
          );
        })}
        <Box
          as="button"
          onClick={onAddSession}
          px={3}
          py={2.5}
          borderRadius="md"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="whiteAlpha.200"
          textAlign="center"
          color="app.primary"
          fontSize="sm"
          fontWeight="bold"
          _hover={{ bg: 'app.primary/8' }}
        >
          + Séance
        </Box>
      </VStack>
    );
  }

  return (
    <HStack
      gap={2}
      overflowX="auto"
      pb={2}
      w="100%"
      css={{ scrollbarWidth: 'none' }}
    >
      {sessions.map((session, index) => {
        const isActive = index === activeIndex;
        return (
          <Box
            key={session._id}
            as="button"
            onClick={() => onSelect(index)}
            flexShrink={0}
            px={3}
            py={1.5}
            borderRadius="full"
            bg={isActive ? 'app.primary' : 'whiteAlpha.100'}
            color={isActive ? 'bg.canvas' : 'fg.muted'}
            fontSize="sm"
            fontWeight="bold"
          >
            S{session.order}
          </Box>
        );
      })}
      <Box
        as="button"
        onClick={onAddSession}
        flexShrink={0}
        px={3}
        py={1.5}
        borderRadius="full"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="whiteAlpha.200"
        color="app.primary"
        display="flex"
        alignItems="center"
        aria-label="Ajouter une séance"
      >
        <LuPlus size={14} />
      </Box>
    </HStack>
  );
};
