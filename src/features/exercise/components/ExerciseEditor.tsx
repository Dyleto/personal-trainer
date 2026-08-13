import { Field } from '@/components/ui/field';
import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { AutoResizeTextarea } from '@/components/AutoResizeTextarea';
import { LuDumbbell, LuTrash2 } from 'react-icons/lu';
import VideoPlayer from '@/components/VideoPlayer';
import { Exercise } from '@/types';

interface ExerciseEditorProps {
  initialData?: Partial<Exercise>;
  isEditing?: boolean;
  isLoading?: boolean;
  onSave: (data: Partial<Exercise>) => void;
  onDelete?: () => void;
  onCancel?: () => void;
}

export const ExerciseEditor = ({
  initialData,
  isEditing = false,
  isLoading = false,
  onSave,
  onDelete,
  onCancel,
}: ExerciseEditorProps) => {
  const colors = useThemeColors();

  const [formData, setFormData] = useState<Partial<Exercise>>({
    name: '',
    description: '',
    videoUrl: '',
    ...initialData,
  });
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  const [nameError, setNameError] = useState('');

  if (initialData && initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setFormData((prev) => ({ ...prev, ...initialData }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setNameError('Le nom est requis');
      return;
    }
    setNameError('');
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <Card.Root>
          <Card.Body>
            <HStack gap={3}>
              <Box
                p={3}
                bg={colors.primaryBg}
                borderRadius="md"
                borderWidth="1px"
                borderColor={colors.primaryBorder}
              >
                <LuDumbbell size={32} color={colors.primaryHex} />
              </Box>
              <Heading size="xl">
                {isEditing ? "Modifier l'exercice" : 'Créer un exercice'}
              </Heading>
            </HStack>
          </Card.Body>
        </Card.Root>

        {/* Formulaire */}
        <Card.Root>
          <Card.Body>
            <VStack gap={5} align="stretch">
              {/* Nom */}
              <Field label="Nom de l'exercice" required>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (nameError) setNameError('');
                  }}
                  placeholder="Ex: Kettlebell Swing"
                  borderColor={nameError ? 'red.400' : undefined}
                  _focus={{ borderColor: nameError ? 'red.400' : undefined }}
                />
                {nameError && (
                  <Text fontSize="xs" color="red.400" mt={1}>
                    {nameError}
                  </Text>
                )}
              </Field>

              {/* Description */}
              <Field label="Description">
                <AutoResizeTextarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Consignes techniques, points clés..."
                />
              </Field>

              {/* URL Vidéo */}
              <Field label="Lien vidéo (optionnel)">
                <Input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  placeholder="https://youtube.com/watch?v=..."
                />
              </Field>

              {formData.videoUrl && (
                <Box>
                  <Box
                    fontSize="sm"
                    fontWeight="medium"
                    mb={2}
                    color="fg.muted"
                  >
                    Aperçu de la vidéo
                  </Box>
                  <VideoPlayer url={formData.videoUrl} />
                </Box>
              )}
            </VStack>
          </Card.Body>
        </Card.Root>

        {/* Actions */}
        <HStack gap={4} justify="flex-end" w="100%">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Annuler
            </Button>
          )}
          {isEditing && onDelete && (
            <Button
              variant="outline"
              colorPalette="red"
              onClick={onDelete}
              loading={isLoading}
            >
              <LuTrash2 style={{ marginRight: '8px' }} />
              Supprimer
            </Button>
          )}
          <Button
            type="submit"
            bg={colors.primary}
            color="gray.900"
            fontWeight="bold"
            loading={isLoading}
          >
            {isEditing ? 'Enregistrer' : 'Créer'}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};
