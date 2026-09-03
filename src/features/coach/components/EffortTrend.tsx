import { Box, HStack, Text, VStack, Wrap } from '@chakra-ui/react';
import { CompletedSession, FeedbackTag } from '@/types';
import {
  EFFORT_ZONE_COLOR,
  FEEDBACK_TAG_LABELS,
  getEffortLevel,
} from '@/features/client/constants';

interface EffortTrendProps {
  /** Déjà filtré sur une seule séance : comparer l'effort d'un Tabata à celui
   *  d'un échauffement ne veut rien dire. */
  history: CompletedSession[];
  /** Nombre de passages retenus pour la lecture. */
  limit?: number;
}

type Drift = 'harder' | 'easier' | null;

/**
 * Une dérive n'est signalée que si elle est nette : au moins trois passages
 * notés, aucune inversion de sens, et une amplitude d'au moins deux niveaux.
 * Le reste, c'est du bruit — et un coach qui voit une alerte pour du bruit
 * cesse de les lire.
 */
const detectDrift = (efforts: number[]): Drift => {
  if (efforts.length < 3) return null;
  const first = efforts[0];
  const last = efforts[efforts.length - 1];
  if (
    last - first >= 2 &&
    efforts.every((v, i) => i === 0 || v >= efforts[i - 1])
  )
    return 'harder';
  if (
    first - last >= 2 &&
    efforts.every((v, i) => i === 0 || v <= efforts[i - 1])
  )
    return 'easier';
  return null;
};

const countTags = (sessions: CompletedSession[]) => {
  const counts = new Map<FeedbackTag, number>();
  sessions.forEach((s) =>
    (s.feedback?.tags ?? []).forEach((tag) =>
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    )
  );
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
};

export const EffortTrend = ({ history, limit = 5 }: EffortTrendProps) => {
  // Du plus ancien au plus récent : une tendance se lit dans le sens du temps.
  const chronological = [...history]
    .sort(
      (a, b) =>
        new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime()
    )
    .slice(-limit);

  const rated = chronological.filter((c) => c.feedback?.effort !== undefined);
  const efforts = rated.map((c) => c.feedback!.effort);
  const drift = detectDrift(efforts);
  const lastLabel =
    getEffortLevel(rated[rated.length - 1]?.feedback?.effort)?.label ?? '—';
  const tags = countTags(rated);

  // Aucun passage noté : les bilans d'avant la refonte n'ont jamais porté la
  // question. On le dit, on ne dessine pas une courbe vide.
  if (rated.length === 0) {
    return (
      <Text fontSize="xs" color="fg.muted">
        {chronological.length > 0
          ? 'Aucun ressenti comparable sur cette séance.'
          : "Cette séance n'a pas encore été faite."}
      </Text>
    );
  }

  return (
    <VStack align="stretch" gap={2}>
      <HStack gap={1.5} align="flex-end" h="34px">
        {chronological.map((completed) => {
          const level = getEffortLevel(completed.feedback?.effort);
          if (!level) {
            // Passage antérieur à la refonte : un creux, jamais une barre
            // inventée.
            return (
              <Box
                key={completed._id}
                flex={1}
                h="3px"
                borderRadius="full"
                bg="whiteAlpha.200"
                title="Ressenti non comparable"
              />
            );
          }
          return (
            <Box
              key={completed._id}
              flex={1}
              h={`${level.value * 20}%`}
              minH="6px"
              borderRadius="sm"
              bg={EFFORT_ZONE_COLOR[level.zone]}
              opacity={0.85}
              title={level.label}
            />
          );
        })}
      </HStack>

      <HStack gap={2} justify="space-between" align="baseline">
        {/* Le mot, pas le chiffre. La suite « 3 → 4 » se lisait comme un code :
            rien à l'écran ne disait sur quelle échelle, ni dans quel sens. */}
        <Text fontSize="2xs" color="fg.muted">
          {rated.length === 1
            ? `Dernier ressenti : ${lastLabel}`
            : `${rated.length} derniers ressentis, du plus ancien au plus récent — ${lastLabel} en dernier`}
        </Text>
        {drift && (
          <Text
            fontSize="2xs"
            fontWeight="bold"
            color={
              drift === 'harder'
                ? EFFORT_ZONE_COLOR.hard
                : EFFORT_ZONE_COLOR.easy
            }
            flexShrink={0}
          >
            {drift === 'harder'
              ? '↗ Devient trop dure'
              : '↘ Devient trop facile'}
          </Text>
        )}
      </HStack>

      {tags.length > 0 && (
        <Wrap gap={1.5}>
          {tags.map(([tag, count]) => (
            <Box
              key={tag}
              px={2}
              py={0.5}
              borderRadius="full"
              borderWidth="1px"
              borderColor="whiteAlpha.200"
              fontSize="2xs"
              color="fg.muted"
            >
              {FEEDBACK_TAG_LABELS[tag]}
              {count > 1 && ` ×${count}`}
            </Box>
          ))}
        </Wrap>
      )}
    </VStack>
  );
};
