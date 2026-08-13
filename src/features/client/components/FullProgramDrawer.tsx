import {
  Box,
  Drawer,
  HStack,
  IconButton,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Session } from "@/types";
import { BlockCard } from "@/features/program/components/BlockCard";
import { useThemeColors } from "@/hooks/useThemeColors";
import { LuCheck, LuZap, LuX } from "react-icons/lu";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
`;

type SessionStatus = "done" | "next" | "upcoming";

function getStatus(
  session: Session,
  nextSession: Session | undefined,
  sessionsDone: number,
  sessions: Session[],
): SessionStatus {
  const index = sessions.findIndex((s) => s._id === session._id);
  if (index < sessionsDone) return "done";
  if (session._id === nextSession?._id) return "next";
  return "upcoming";
}

interface SessionPanelProps {
  session: Session;
  status: SessionStatus;
}

const SessionPanel = ({ session, status }: SessionPanelProps) => {
  const colors = useThemeColors();

  const statusConfig = {
    done: { label: "Terminée", color: "green.400", bg: "green.400/10" },
    next: {
      label: "À faire",
      color: colors.primary,
      bg: `${colors.primaryHex}18`,
    },
    upcoming: { label: "À venir", color: "gray.500", bg: "whiteAlpha.50" },
  }[status];

  return (
    <Box
      borderRadius="xl"
      borderWidth="1px"
      borderColor={
        status === "next" ? `${colors.primaryHex}30` : "whiteAlpha.100"
      }
      overflow="hidden"
      opacity={status === "upcoming" ? 0.6 : 1}
    >
      {/* Header séance */}
      <Box
        px={4}
        py={3}
        bg={status === "next" ? `${colors.primaryHex}12` : "whiteAlpha.50"}
      >
        <HStack justify="space-between" align="center">
          <HStack gap={3}>
            <HStack
              gap={1.5}
              px={2}
              py={0.5}
              borderRadius="full"
              bg={statusConfig.bg}
              borderWidth="1px"
              borderColor={`${statusConfig.color}/30`}
            >
              {status === "done" && (
                <LuCheck size={10} color="var(--chakra-colors-green-400)" />
              )}
              {status === "next" && (
                <Box
                  w="5px"
                  h="5px"
                  borderRadius="full"
                  bg={colors.primary}
                  animation={`${pulse} 2s ease-in-out infinite`}
                />
              )}
              <Text fontSize="xs" fontWeight="bold" color={statusConfig.color}>
                {statusConfig.label}
              </Text>
            </HStack>
            <HStack gap={1.5}>
              <LuZap size={13} color={colors.primaryHex} />
              <Text fontWeight="bold" fontSize="sm">
                Séance {session.order}
              </Text>
            </HStack>
          </HStack>
        </HStack>

        {session.notes && (
          <Box
            mt={2}
            p={2.5}
            bg="whiteAlpha.50"
            borderRadius="md"
            borderLeft="2px solid"
            borderLeftColor={colors.primaryBorder}
          >
            <Text fontSize="xs" color="gray.400" whiteSpace="pre-wrap">
              {session.notes}
            </Text>
          </Box>
        )}
      </Box>

      {/* Blocs */}
      {session.blocks.length > 0 ? (
        <VStack align="stretch" gap={2} p={3}>
          {session.blocks.map((block) => (
            <BlockCard key={block._id} block={block} />
          ))}
        </VStack>
      ) : (
        <Box px={4} py={3}>
          <Text fontSize="sm" color="gray.600">
            Aucun bloc pour cette séance.
          </Text>
        </Box>
      )}
    </Box>
  );
};

interface FullProgramDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  nextSession: Session | undefined;
  sessionsDoneInCurrentCycle: number;
}

export const FullProgramDrawer = ({
  isOpen,
  onClose,
  sessions,
  nextSession,
  sessionsDoneInCurrentCycle,
}: FullProgramDrawerProps) => {
  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      size={{ base: "full", md: "md", lg: "lg" }}
    >
      <Drawer.Positioner>
        <Drawer.Content bg="gray.900">
          <Drawer.Header borderBottomWidth="1px" borderColor="whiteAlpha.100">
            <HStack justify="space-between" align="center" flex="1">
              <Text fontWeight="bold" fontSize="lg">
                Mon programme
              </Text>
              <IconButton
                aria-label="Fermer"
                size="sm"
                variant="ghost"
                color="gray.500"
                _hover={{ color: "white", bg: "whiteAlpha.100" }}
                borderRadius="full"
                onClick={onClose}
              >
                <LuX size={16} />
              </IconButton>
            </HStack>
          </Drawer.Header>

          <Drawer.Body p={4}>
            {sessions.length === 0 ? (
              <Box py={16} textAlign="center" color="gray.600" fontSize="sm">
                Aucune séance dans le programme.
              </Box>
            ) : (
              <VStack align="stretch" gap={4}>
                <Text fontSize="xs" color="gray.500">
                  {sessions.length} séance{sessions.length > 1 ? "s" : ""} dans
                  ce cycle
                </Text>
                <Separator borderColor="whiteAlpha.100" />
                {sessions.map((session) => (
                  <SessionPanel
                    key={session._id}
                    session={session}
                    status={getStatus(
                      session,
                      nextSession,
                      sessionsDoneInCurrentCycle,
                      sessions,
                    )}
                  />
                ))}
              </VStack>
            )}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
