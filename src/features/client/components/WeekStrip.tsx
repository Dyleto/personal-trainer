import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { CompletedSession } from '@/types';
import { EFFORT_ZONE_COLOR } from '../constants';
import { getEffortSummary } from '../format';
import { dayKey } from '../sessionDates';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

/** Lundi = 0 : la semaine française ne commence pas le dimanche. */
const mondayIndex = (date: Date) => (date.getDay() + 6) % 7;

const startOfWeek = (from: Date): Date => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  d.setDate(d.getDate() - mondayIndex(d));
  return d;
};

interface WeekStripProps {
  history: CompletedSession[];
}

/**
 * La semaine en cours, lundi à dimanche, avec une marque les jours
 * d'entraînement.
 *
 * L'accueil disait ce qu'il restait à faire et ce qui venait d'être fait,
 * jamais où on en était de sa semaine. « J'y suis allé deux fois » se compte
 * autrement quand on le voit — et un lundi vide en fin de journée n'est pas
 * la même information qu'un lundi vide le matin.
 */
export const WeekStrip = ({ history }: WeekStripProps) => {
  const today = new Date();
  const todayKey = dayKey(today);

  const days = useMemo(() => {
    const monday = startOfWeek(today);
    const byDay = new Map<string, CompletedSession[]>();
    history.forEach((completed) => {
      const key = dayKey(new Date(completed.completedAt));
      const list = byDay.get(key);
      if (list) list.push(completed);
      else byDay.set(key, [completed]);
    });

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i
      );
      const key = dayKey(date);
      return { date, key, sessions: byDay.get(key) ?? [] };
    });
    // `today` est recalculé à chaque rendu mais ne change qu'une fois par
    // jour : c'est `history` qui décide du contenu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, todayKey]);

  const count = days.reduce((sum, d) => sum + d.sessions.length, 0);

  return (
    <VStack align="stretch" gap={2}>
      <HStack justify="space-between" align="baseline">
        <Text
          fontSize="xs"
          fontWeight="bold"
          color="fg.muted"
          textTransform="uppercase"
          letterSpacing="wider"
        >
          Cette semaine
        </Text>
        <Text fontSize="xs" color="fg.muted">
          {count === 0
            ? 'aucune séance'
            : `${count} séance${count > 1 ? 's' : ''}`}
        </Text>
      </HStack>

      <HStack gap={1} role="list" aria-label="Séances de la semaine">
        {days.map(({ date, key, sessions }) => {
          const isToday = key === todayKey;
          const isFuture = key > todayKey;
          const effort =
            sessions.length > 0 ? getEffortSummary(sessions[0]) : null;

          return (
            <VStack
              key={key}
              role="listitem"
              aria-label={`${WEEKDAYS[mondayIndex(date)]} ${date.getDate()} — ${
                sessions.length === 0
                  ? 'aucune séance'
                  : `${sessions.length} séance${sessions.length > 1 ? 's' : ''}`
              }`}
              flex={1}
              minW={0}
              gap={1}
              py={2}
              borderRadius="md"
              borderWidth="1px"
              borderColor={isToday ? 'app.primary' : 'transparent'}
              bg={sessions.length > 0 ? 'whiteAlpha.50' : 'transparent'}
              opacity={isFuture ? 0.45 : 1}
            >
              <Text fontSize="xs" color="fg.muted" aria-hidden>
                {WEEKDAYS[mondayIndex(date)]}
              </Text>
              <Text
                fontSize="xs"
                fontFamily="mono"
                color={sessions.length > 0 ? 'fg' : 'whiteAlpha.600'}
                fontWeight={isToday ? 'bold' : 'normal'}
                aria-hidden
              >
                {date.getDate()}
              </Text>
              {/* La même pastille que le calendrier de l'historique : une par
                  séance, couleur du ressenti. On lit la même chose ici. */}
              <HStack gap="2px" h="5px" justify="center" aria-hidden>
                {sessions.map((s) => (
                  <Box
                    key={s._id}
                    w="5px"
                    h="5px"
                    borderRadius="full"
                    bg={effort ? EFFORT_ZONE_COLOR[effort.zone] : 'app.primary'}
                  />
                ))}
              </HStack>
            </VStack>
          );
        })}
      </HStack>
    </VStack>
  );
};
