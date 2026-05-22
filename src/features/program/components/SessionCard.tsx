import { BlockExercise, BlockType, Session, SessionBlock } from "@/types";
import { calculateSessionDuration } from "@/utils/sessionUtils";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea";
import { LuArrowRight, LuPlus, LuTrash2 } from "react-icons/lu";
import { Card } from "@/components/Card";
import { SessionHeader } from "./SessionHeader";
import { BlockCard } from "./BlockCard";
import { BlockEditor } from "./BlockEditor";
import { BlockTypeSelector } from "./BlockTypeSelector";
import { useState } from "react";

interface SessionCardProps {
  session: Session;
  interactive?: boolean;
  isEditing?: boolean;
  onComplete?: () => void;
  // Edit callbacks
  onRemoveSession?: () => void;
  onUpdateSessionNotes?: (notes: string) => void;
  onAddBlock?: (type: BlockType) => void;
  onRemoveBlock?: (blockId: string) => void;
  onUpdateBlock?: (blockId: string, updates: Partial<SessionBlock>) => void;
  onAddExercise?: (blockId: string) => void;
  onRemoveExercise?: (blockId: string, index: number) => void;
  onUpdateExercise?: (
    blockId: string,
    index: number,
    updates: Partial<Omit<BlockExercise, "exercise">>,
  ) => void;
}

export const SessionCard = ({
  session,
  interactive = true,
  isEditing,
  onComplete,
  onRemoveSession,
  onUpdateSessionNotes,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
}: SessionCardProps) => {
  const colors = useThemeColors();
  const [showBlockSelector, setShowBlockSelector] = useState(false);

  const duration = calculateSessionDuration(session);

  return (
    <Card p={0} accentColor={colors.primary} hoverEffect={interactive ? "both" : "none"}>
      <VStack align="stretch" gap={0}>
          {/* Header */}
          <SessionHeader order={session.order} duration={duration} />

          {/* Notes */}
          {(isEditing || session.notes) && (
            <Box mx={4} mb={3}>
              {isEditing ? (
                <AutoResizeTextarea
                  value={session.notes || ""}
                  onChange={(e) => onUpdateSessionNotes?.(e.target.value)}
                  placeholder="Notes pour cette séance..."
                  size="sm"
                  border="1px solid"
                  borderColor={colors.primaryBorder}
                  _focus={{ borderColor: colors.primary }}
                  borderRadius="md"
                  fontSize="sm"
                />
              ) : (
                session.notes && (
                  <Box
                    p={3}
                    bg="whiteAlpha.50"
                    borderRadius="md"
                    borderLeft="3px solid"
                    borderLeftColor={colors.primaryBorder}
                  >
                    <Text fontSize="xs" color="gray.400" mb={1} fontWeight="bold">
                      Note du coach
                    </Text>
                    <Text fontSize="sm" color="gray.300" whiteSpace="pre-wrap">
                      {session.notes}
                    </Text>
                  </Box>
                )
              )}
            </Box>
          )}

          {/* Blocks */}
          <VStack align="stretch" gap={2} px={4} pb={4}>
            {session.blocks.map((block) =>
              isEditing ? (
                <BlockEditor
                  key={block._id}
                  block={block}
                  onUpdate={(updates) => onUpdateBlock?.(block._id, updates)}
                  onRemove={() => onRemoveBlock?.(block._id)}
                  onAddExercise={() => onAddExercise?.(block._id)}
                  onRemoveExercise={(i) => onRemoveExercise?.(block._id, i)}
                  onUpdateExercise={(i, updates) =>
                    onUpdateExercise?.(block._id, i, updates)
                  }
                />
              ) : (
                <BlockCard key={block._id} block={block} />
              ),
            )}

            {/* Add block (edit mode) */}
            {isEditing && (
              <>
                {showBlockSelector ? (
                  <Box
                    p={3}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="whiteAlpha.200"
                    bg="whiteAlpha.50"
                  >
                    <HStack justify="space-between" mb={3}>
                      <Text fontSize="sm" fontWeight="bold" color="gray.300">
                        Choisir un type de bloc
                      </Text>
                      <Button
                        size="xs"
                        variant="ghost"
                        color="gray.500"
                        onClick={() => setShowBlockSelector(false)}
                      >
                        Annuler
                      </Button>
                    </HStack>
                    <BlockTypeSelector
                      onSelect={(type) => {
                        onAddBlock?.(type);
                        setShowBlockSelector(false);
                      }}
                    />
                  </Box>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    borderWidth="1px"
                    borderColor="whiteAlpha.200"
                    borderStyle="dashed"
                    borderRadius="lg"
                    onClick={() => setShowBlockSelector(true)}
                    _hover={{ bg: "whiteAlpha.100", color: "gray.200" }}
                    w="full"
                  >
                    <LuPlus size={14} />
                    Ajouter un bloc
                  </Button>
                )}
              </>
            )}

            {/* Empty state */}
            {!isEditing && session.blocks.length === 0 && (
              <Box
                p={6}
                textAlign="center"
                bg="whiteAlpha.50"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="whiteAlpha.100"
              >
                <Text color="gray.500" fontSize="sm">
                  Cette séance ne contient aucun bloc.
                </Text>
              </Box>
            )}
          </VStack>

          {/* Delete session (edit mode) */}
          {isEditing && (
            <>
              <Separator borderColor="whiteAlpha.100" />
              <Button
                variant="ghost"
                size="sm"
                color="gray.600"
                _hover={{ color: "red.400", bg: "red.400/8" }}
                onClick={onRemoveSession}
                w="full"
                borderRadius={0}
                py={4}
                gap={2}
              >
                <LuTrash2 size={14} />
                Supprimer la séance
              </Button>
            </>
          )}

          {/* Complete button (client view) */}
          {onComplete && (
            <Box px={4} pb={4} pt={2}>
              <Button
                w="full"
                bg={colors.primary}
                color="gray.900"
                fontWeight="bold"
                size="lg"
                onClick={onComplete}
                _hover={{ bg: colors.primaryHover }}
              >
                J'ai terminé cette séance <LuArrowRight />
              </Button>
            </Box>
          )}
        </VStack>
    </Card>
  );
};
