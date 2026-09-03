import { Box, HStack, Input, Text } from '@chakra-ui/react';
import { PerformedValues } from '@/types';

interface PerformedFieldsProps {
  value: PerformedValues;
  onChange: (next: PerformedValues) => void;
  /** « la dernière fois : 24 kg · 4 × 10 », ou `null` s'il n'y a rien à dire. */
  lastLabel?: string | null;
  /** L'exercice se mesure en temps : demander des répétitions n'a pas de
   *  sens, on ne montre alors que la charge. */
  isTimed?: boolean;
}

type NumericField = 'weight' | 'reps';

// Une chaîne vide efface la clé plutôt que d'écrire 0 : « non renseigné » ne
// doit jamais ressembler à « zéro », ni ici ni dans ce qu'on envoie à l'API.
const parse = (raw: string): number | undefined => {
  const trimmed = raw.trim().replace(',', '.');
  if (trimmed === '') return undefined;
  const n = Number(trimmed);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

const Field = ({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value?: number;
  onChange: (v?: number) => void;
}) => (
  <HStack gap={1} align="center">
    <Input
      size="xs"
      w="52px"
      textAlign="center"
      inputMode="decimal"
      aria-label={label}
      placeholder="—"
      value={value === undefined ? '' : String(value)}
      onChange={(e) => onChange(parse(e.target.value))}
      bg="whiteAlpha.50"
      borderColor="whiteAlpha.100"
      _placeholder={{ color: 'fg.muted', opacity: 0.6 }}
      _focus={{ borderColor: 'app.primary.border', bg: 'whiteAlpha.100' }}
      borderRadius="md"
      fontFamily="mono"
    />
    <Text fontSize="2xs" color="fg.muted">
      {suffix}
    </Text>
  </HStack>
);

export const PerformedFields = ({
  value,
  onChange,
  lastLabel,
  isTimed = false,
}: PerformedFieldsProps) => {
  const set = (field: NumericField, v?: number) =>
    onChange({ ...value, [field]: v });

  return (
    <Box pl={4}>
      <HStack gap={3} align="center" flexWrap="wrap">
        <Text fontSize="2xs" color="fg.muted" flexShrink={0}>
          Fait&nbsp;:
        </Text>
        <Field
          label="Poids utilisé, en kilos"
          suffix="kg"
          value={value.weight}
          onChange={(v) => set('weight', v)}
        />
        {!isTimed && (
          <Field
            label="Répétitions réellement faites"
            suffix="reps"
            value={value.reps}
            onChange={(v) => set('reps', v)}
          />
        )}
      </HStack>

      {lastLabel && (
        <Text fontSize="2xs" color="fg.muted" mt={1} opacity={0.8}>
          la dernière fois&nbsp;: {lastLabel}
        </Text>
      )}
    </Box>
  );
};
