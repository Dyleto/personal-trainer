import { SessionMetrics } from '@/types';
import { MetricScale } from './MetricScale';
import { Box, Button, Dialog, Separator, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import { DateInput } from '@/components/DateInput';
import { METRICS_CONFIG } from '@/features/client/constants';
import { LuX } from 'react-icons/lu';

interface CompleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    metrics: SessionMetrics,
    notes: string,
    completedAt?: string
  ) => void;
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
  const [metrics, setMetrics] = useState<SessionMetrics>(DEFAULT_METRICS);
  const [notes, setNotes] = useState('');
  const [completedAt, setCompletedAt] = useState(toDateInputValue(new Date()));

  const handleSubmit = () => {
    const today = toDateInputValue(new Date());
    onSubmit(metrics, notes, completedAt !== today ? completedAt : undefined);
    handleClose();
  };

  const handleClose = () => {
    setMetrics(DEFAULT_METRICS);
    setNotes('');
    setCompletedAt(toDateInputValue(new Date()));
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && handleClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content
          bg="bg.canvas"
          borderColor="whiteAlpha.100"
          borderWidth="1px"
        >
          <Dialog.Header>
            <VStack align="start" gap={1}>
              <Dialog.Title>Bilan de séance</Dialog.Title>
              <Text fontSize="sm" color="fg.muted" fontWeight="normal">
                Ton ressenti aide ton coach à adapter la suite.
              </Text>
            </VStack>
          </Dialog.Header>
          <Dialog.CloseTrigger aria-label="Fermer">
            <LuX size={16} />
          </Dialog.CloseTrigger>

          <Dialog.Body>
            <VStack gap={4} align="stretch">
              <VStack align="center" gap={1.5}>
                <Text fontSize="xs" color="fg.muted" letterSpacing="wide">
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

              <VStack gap={4} align="stretch">
                {METRICS_CONFIG.map(
                  ({ key, Icon, label, lowLabel, highLabel }) => (
                    <MetricScale
                      key={key}
                      icon={
                        <Icon
                          size={16}
                          color="var(--chakra-colors-app-primary)"
                        />
                      }
                      label={label}
                      lowLabel={lowLabel}
                      highLabel={highLabel}
                      value={metrics[key]}
                      onChange={(val) =>
                        setMetrics((prev) => ({ ...prev, [key]: val }))
                      }
                    />
                  )
                )}
              </VStack>

              <Separator borderColor="whiteAlpha.100" />

              <Box>
                <Text fontSize="sm" color="fg.muted" mb={2}>
                  Commentaire (facultatif)
                </Text>
                <AutoResizeTextarea
                  placeholder="Ex : bonne séance, un peu difficile sur les derniers rounds..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="sm"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  _focus={{ borderColor: 'app.primary.border' }}
                />
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer gap={3}>
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button
              bg="app.primary"
              color="bg.canvas"
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
