import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { CompletedSession } from '@/types';
import { EFFORT_ZONE_COLOR } from '../constants';
import { getEffortSummary } from '../format';
import { dayKey } from '../sessionDates';

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const monthLabel = (d: Date) =>
  new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(
    d
  );

/** Lundi = 0 : la semaine française ne commence pas le dimanche. */
const mondayIndex = (date: Date) => (date.getDay() + 6) % 7;

interface SessionCalendarProps {
  history: CompletedSession[];
  /** Jour affiché en détail, ou `null` pour « tout le mois ». */
  selectedDay: string | null;
  onSelectDay: (day: string | null) => void;
}

/**
 * Le mois, avec une pastille les jours où le client s'est entraîné.
 *
 * Une liste répond à « qu'a-t-il fait ? », pas à « à quel rythme ? ». Deux
 * séances collées puis dix jours de rien, ça se voit sur un calendrier et
 * ça se compte péniblement sur une liste. La couleur de la pastille reprend
 * le ressenti déclaré : on lit une charge de travail d'un coup d'œil.
 */
export const SessionCalendar = ({
  history,
  selectedDay,
  onSelectDay,
}: SessionCalendarProps) => {
  // On ouvre sur le mois de la séance la plus récente, pas sur le mois
  // courant : un client à l'arrêt depuis six semaines afficherait une grille
  // vide, et on croirait le journal cassé.
  const [cursor, setCursor] = useState(() => {
    const latest = history[0]?.completedAt;
    const base = latest ? new Date(latest) : new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const byDay = useMemo(() => {
    const map = new Map<string, CompletedSession[]>();
    history.forEach((completed) => {
      const key = dayKey(new Date(completed.completedAt));
      const list = map.get(key);
      if (list) list.push(completed);
      else map.set(key, [completed]);
    });
    return map;
  }, [history]);

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const daysInMonth = new Date(
      cursor.getFullYear(),
      cursor.getMonth() + 1,
      0
    ).getDate();

    const list: (Date | null)[] = Array(mondayIndex(first)).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      list.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }
    return list;
  }, [cursor]);

  const shiftMonth = (delta: number) => {
    setCursor(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1)
    );
    onSelectDay(null);
  };

  const todayKey = dayKey(new Date());
  const monthCount = cells.reduce(
    (sum, date) => (date ? sum + (byDay.get(dayKey(date))?.length ?? 0) : sum),
    0
  );

  return (
    <VStack align="stretch" gap={3}>
      <HStack justify="space-between" align="center">
        <Box
          as="button"
          aria-label="Mois précédent"
          onClick={() => shiftMonth(-1)}
          color="fg.muted"
          _hover={{ color: 'app.primary' }}
          px={1}
        >
          <LuChevronLeft size={16} />
        </Box>
        <VStack gap={0}>
          <Text
            fontSize="sm"
            fontWeight="bold"
            textTransform="capitalize"
            aria-live="polite"
          >
            {monthLabel(cursor)}
          </Text>
          <Text fontSize="2xs" color="fg.muted">
            {monthCount === 0
              ? 'aucune séance'
              : `${monthCount} séance${monthCount > 1 ? 's' : ''}`}
          </Text>
        </VStack>
        <Box
          as="button"
          aria-label="Mois suivant"
          onClick={() => shiftMonth(1)}
          color="fg.muted"
          _hover={{ color: 'app.primary' }}
          px={1}
        >
          <LuChevronRight size={16} />
        </Box>
      </HStack>

      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={1}
        role="grid"
        aria-label={`Séances de ${monthLabel(cursor)}`}
      >
        {WEEKDAYS.map((letter, i) => (
          <Text
            key={`${letter}-${i}`}
            fontSize="2xs"
            color="fg.muted"
            textAlign="center"
            pb={1}
            aria-hidden
          >
            {letter}
          </Text>
        ))}

        {cells.map((date, index) => {
          if (!date) return <Box key={`empty-${index}`} />;

          const key = dayKey(date);
          const sessions = byDay.get(key) ?? [];
          const isSelected = selectedDay === key;
          const isToday = key === todayKey;

          // La pastille prend la couleur du ressenti. Plusieurs séances le
          // même jour : celle du dernier bilan enregistré.
          const effort =
            sessions.length > 0 ? getEffortSummary(sessions[0]) : null;
          const dotColor = effort
            ? EFFORT_ZONE_COLOR[effort.zone]
            : 'app.primary';

          // Un jour sans séance n'est pas une commande désactivée : ce n'est
          // pas une commande du tout. Il ne va donc pas dans l'ordre de
          // tabulation, et un lecteur d'écran ne l'annonce pas.
          const isActionable = sessions.length > 0;

          return (
            <Box
              key={key}
              as={isActionable ? 'button' : undefined}
              aria-label={
                isActionable
                  ? `${date.getDate()} — ${sessions.length} séance${sessions.length > 1 ? 's' : ''}`
                  : undefined
              }
              aria-pressed={isActionable ? isSelected : undefined}
              onClick={
                isActionable
                  ? () => onSelectDay(isSelected ? null : key)
                  : undefined
              }
              py={1.5}
              borderRadius="md"
              borderWidth="1px"
              borderColor={isSelected ? 'app.primary' : 'transparent'}
              bg={isSelected ? 'app.primary/12' : 'transparent'}
              cursor={isActionable ? 'pointer' : 'default'}
              _hover={isActionable ? { bg: 'whiteAlpha.50' } : undefined}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'app.primary',
                outlineOffset: '1px',
              }}
              transition="background-color 0.12s"
            >
              <VStack gap={0.5}>
                <Text
                  fontSize="xs"
                  fontFamily="mono"
                  color={
                    isActionable
                      ? 'fg'
                      : isToday
                        ? 'fg.muted'
                        : 'whiteAlpha.400'
                  }
                  fontWeight={isToday ? 'bold' : 'normal'}
                  textDecoration={isToday ? 'underline' : 'none'}
                  textUnderlineOffset="2px"
                >
                  {date.getDate()}
                </Text>
                {/* Une pastille par séance : deux le même jour se voient. */}
                <HStack gap="2px" h="5px" justify="center">
                  {sessions.map((s) => (
                    <Box
                      key={s._id}
                      w="5px"
                      h="5px"
                      borderRadius="full"
                      bg={dotColor}
                    />
                  ))}
                </HStack>
              </VStack>
            </Box>
          );
        })}
      </Box>
    </VStack>
  );
};
