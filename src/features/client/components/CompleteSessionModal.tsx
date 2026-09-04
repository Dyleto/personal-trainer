import { FeedbackTag, SessionFeedback } from '@/types';
import { Box, Button, Dialog, Separator, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import { DateInput } from '@/components/DateInput';
import { LuX } from 'react-icons/lu';
import { EffortScale } from './EffortScale';
import { FeedbackTags } from './FeedbackTags';

interface CompleteSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    feedback: SessionFeedback,
    notes: string,
    completedAt?: string
  ) => void;
  isLoading?: boolean;
}

const toDateInputValue = (d: Date) => d.toISOString().slice(0, 10);

export const CompleteSessionModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CompleteSessionModalProps) => {
  const [effort, setEffort] = useState<number | undefined>(undefined);
  const [tags, setTags] = useState<FeedbackTag[]>([]);
  const [notes, setNotes] = useState('');
  const [completedAt, setCompletedAt] = useState(toDateInputValue(new Date()));

  const handleClose = () => {
    setEffort(undefined);
    setTags([]);
    setNotes('');
    setCompletedAt(toDateInputValue(new Date()));
    onClose();
  };

  const handleSubmit = () => {
    if (effort === undefined) return;
    const today = toDateInputValue(new Date());
    onSubmit(
      { effort, ...(tags.length > 0 ? { tags } : {}) },
      notes,
      completedAt !== today ? completedAt : undefined
    );
    handleClose();
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
              <Dialog.Title>Cette séance, c'était&nbsp;?</Dialog.Title>
              <Text fontSize="sm" color="fg.muted" fontWeight="normal">
                Ton ressenti aide ton coach à adapter la suite. C'est la seule
                chose qu'on te demande.
              </Text>
            </VStack>
          </Dialog.Header>
          <Dialog.CloseTrigger
            aria-label="Fermer"
            display="flex"
            alignItems="center"
            justifyContent="center"
            minW="44px"
            minH="44px"
          >
            <LuX size={16} />
          </Dialog.CloseTrigger>

          <Dialog.Body>
            <VStack gap={4} align="stretch">
              <EffortScale value={effort} onChange={setEffort} />

              <Separator borderColor="whiteAlpha.100" />

              <Box>
                <Text fontSize="sm" color="fg.muted" mb={2}>
                  Quelque chose à signaler&nbsp;? (facultatif)
                </Text>
                <FeedbackTags value={tags} onChange={setTags} />
              </Box>

              <Box>
                <Text fontSize="sm" color="fg.muted" mb={2}>
                  Commentaire (facultatif)
                </Text>
                <AutoResizeTextarea
                  aria-label="Commentaire sur la séance"
                  placeholder="Ex : bonne séance, un peu difficile sur les derniers rounds..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="sm"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  _focus={{ borderColor: 'app.primary.border' }}
                />
              </Box>

              <Separator borderColor="whiteAlpha.100" />

              <VStack align="center" gap={1.5}>
                <Text fontSize="xs" color="fg.muted" letterSpacing="wide">
                  Date de réalisation
                </Text>
                <Box w="45%">
                  <DateInput
                    ariaLabel="Date de réalisation de la séance"
                    value={completedAt}
                    max={toDateInputValue(new Date())}
                    onChange={setCompletedAt}
                  />
                </Box>
              </VStack>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer gap={3}>
            {/* Un bouton grisé sans explication a l'air cassé. On dit ce qui
                manque, à côté de ce qui ne part pas. */}
            {effort === undefined && (
              <Text fontSize="xs" color="fg.muted" mr="auto">
                Choisis un cran pour valider.
              </Text>
            )}
            <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
              Annuler
            </Button>
            {/* Seul champ obligatoire du formulaire, et il le reste vraiment :
                pré-cocher « 3 » enregistrerait une valeur que le client n'a
                jamais choisie, et elle nourrirait la tendance lue par le coach. */}
            <Button
              bg="app.primary"
              color="bg.canvas"
              fontWeight="bold"
              onClick={handleSubmit}
              disabled={effort === undefined}
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
