import { useState } from 'react';
import { Box, HStack, Text } from '@chakra-ui/react';
import { hitArea } from '@/components/hitArea';
import {
  WEEKDAY_FULL,
  WEEKDAY_SHORT,
  formatSuggestedDays,
} from '@/features/client/sessionDates';

interface SuggestedDaysPickerProps {
  value?: number[];
  onChange: (days: number[]) => void;
}

/**
 * Les jours où le coach conseille cette séance. Lundi = 0.
 *
 * Facultatif de bout en bout : une séance sans jour se comporte exactement
 * comme avant, et la rangée ne s'affiche que si le coach la demande. Comme la
 * note de séance, l'invitation ne s'impose pas — un atelier qui montre sept
 * cases vides sur chaque séance se lit comme un formulaire à remplir.
 *
 * Plusieurs jours sont permis, et c'est le cas courant : un full body se fait
 * lundi, mercredi et vendredi. Rien n'empêche non plus deux séances le même
 * jour — ce n'est pas un conflit à arbitrer, juste deux conseils.
 */
export const SuggestedDaysPicker = ({
  value,
  onChange,
}: SuggestedDaysPickerProps) => {
  const days = value ?? [];
  const [isOpen, setIsOpen] = useState(false);

  if (days.length === 0 && !isOpen) {
    return (
      <Box
        as="button"
        aria-label="Choisir les jours conseillés pour cette séance"
        onClick={() => setIsOpen(true)}
        fontSize="xs"
        color="fg.muted"
        minH="32px"
        display="flex"
        alignItems="center"
        opacity={{ base: 0.7, md: 0 }}
        css={hitArea(32)}
        _groupHover={{ opacity: 0.7 }}
        _focusVisible={{
          opacity: 1,
          outline: '2px solid',
          outlineColor: 'app.primary',
          outlineOffset: '2px',
        }}
        transition="opacity 0.15s"
      >
        + jour conseillé
      </Box>
    );
  }

  const toggle = (day: number) => {
    // Décocher la dernière case ramenait `days` à zéro et repliait la rangée
    // sous le doigt du coach, au milieu de son geste. Une fois ouverte, elle
    // reste ouverte : c'est lui qui décide quand elle a fini de servir.
    setIsOpen(true);
    onChange(
      days.includes(day)
        ? days.filter((d) => d !== day)
        : [...days, day].sort((a, b) => a - b)
    );
  };

  return (
    <HStack gap={2} align="center" wrap="wrap">
      <HStack gap={1} role="group" aria-label="Jours conseillés">
        {WEEKDAY_SHORT.map((short, day) => {
          const active = days.includes(day);
          return (
            <Box
              as="button"
              key={day}
              aria-pressed={active}
              aria-label={WEEKDAY_FULL[day]}
              onClick={() => toggle(day)}
              px={2}
              py={1}
              minW="34px"
              borderRadius="md"
              borderWidth="1px"
              borderColor={active ? 'app.primary' : 'whiteAlpha.200'}
              bg={active ? 'app.primary/16' : 'transparent'}
              color={active ? 'app.primary' : 'fg.muted'}
              fontSize="xs"
              fontWeight={active ? 'bold' : 'normal'}
              css={hitArea(32)}
              _hover={{ borderColor: active ? 'app.primary' : 'whiteAlpha.400' }}
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'app.primary',
                outlineOffset: '2px',
              }}
              transition="border-color 0.15s, background-color 0.15s"
            >
              {short}
            </Box>
          );
        })}
      </HStack>
      {/* Ce que la rangée veut dire, en toutes lettres : sept boutons cochés
          ne se relisent pas d'un coup d'œil, une phrase si. */}
      <Text fontSize="xs" color="fg.muted">
        {days.length === 0
          ? 'aucun jour conseillé'
          : `conseillée ${formatSuggestedDays(days)}`}
      </Text>
    </HStack>
  );
};
