import { SessionMetrics } from "@/types";
import { useThemeColors } from "@/hooks/useThemeColors";
import { MetricStars } from "./MetricStars";
import {
  Box,
  Button,
  Dialog,
  HStack,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AutoResizeTextarea } from "@/components/AutoResizeTextarea";
import { DateInput } from "@/components/DateInput";
import { METRICS_CONFIG } from "@/constants/metricsConfig";

interface CompleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (metrics: SessionMetrics, notes: string, completedAt?: string) => void;
  isLoading?: boolean;
}

const DEFAULT_METRICS: SessionMetrics = {
  stress: 3,
  mood: 3,
  energy: 3,
  sleep: 3,
  soreness: 3,
};

const toDateInputValue = (d: Date) => d.toISOString().slice(0, 10);

export const CompleteSessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CompleteSessionModalProps) => {
  const colors = useThemeColors();
  const [metrics, setMetrics] = useState<SessionMetrics>(DEFAULT_METRICS);
  const [notes, setNotes] = useState("");
  const [completedAt, setCompletedAt] = useState(toDateInputValue(new Date()));

  const handleSubmit = () => {
    const today = toDateInputValue(new Date());
    onSubmit(metrics, notes, completedAt !== today ? completedAt : undefined);
    handleClose();
  };

  const handleClose = () => {
    setMetrics(DEFAULT_METRICS);
    setNotes("");
    setCompletedAt(toDateInputValue(new Date()));
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bg="gray.900"
          borderColor="whiteAlpha.100"
          borderWidth="1px"
        >
          <Dialog.Header>
            <VStack align="start" gap={1}>
              <Dialog.Title>Comment s'est passée la séance ?</Dialog.Title>
              <Text fontSize="sm" color="gray.400" fontWeight="normal">
                Note ton ressenti pour que ton coach puisse adapter le programme.
              </Text>
            </VStack>
          </Dialog.Header>
          <Dialog.CloseTrigger />

          <Dialog.Body>
            <VStack gap={4} align="stretch">
              <VStack align="center" gap={1.5}>
                <Text fontSize="xs" color="gray.600" letterSpacing="wide">
                  Date de réalisation
                </Text>
                <Box w="45%">
                  <DateInput
                    value={completedAt}
                    max={toDateInputValue(new Date())}
                    onChange={setCompletedAt}
                  />
                </Box>
              </VStack>

              <Separator borderColor="whiteAlpha.100" />

              <VStack gap={3} align="stretch">
                {/* En-tête d'échelle commun */}
                <HStack justify="flex-end">
                  <HStack w="140px" justify="space-between" align="center" gap={2}>
                    <Text fontSize="2xs" color="gray.500" whiteSpace="nowrap">
                      1 · Pas top
                    </Text>
                    <Box flex={1} h="1px" bg="gray.800" />
                    <Text fontSize="2xs" color="gray.500" whiteSpace="nowrap">
                      5 · Pleine forme
                    </Text>
                  </HStack>
                </HStack>

                {METRICS_CONFIG.map(({ key, Icon, label }) => (
                  <MetricStars
                    key={key}
                    icon={<Icon size={16} color={colors.primaryHex} />}
                    label={label}
                    value={metrics[key]}
                    starsW="140px"
                    onChange={(val) =>
                      setMetrics((prev) => ({ ...prev, [key]: val }))
                    }
                  />
                ))}
              </VStack>

              <Separator borderColor="whiteAlpha.100" />

              <Box>
                <Text fontSize="sm" color="gray.400" mb={2}>
                  Commentaire (facultatif)
                </Text>
                <AutoResizeTextarea
                  placeholder="Ex : bonne séance, un peu difficile sur les derniers rounds..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="sm"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  _focus={{ borderColor: colors.primaryBorder }}
                />
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer gap={3}>
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              bg={colors.primary}
              color="gray.900"
              fontWeight="bold"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Valider
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
