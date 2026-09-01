import { HStack, Text } from '@chakra-ui/react';
import { SessionBlock } from '@/types';
import { InlineSequence, InlineValue } from './InlineValue';

interface BlockConfigInlineProps {
  block: SessionBlock;
  onUpdate: (updates: Partial<SessionBlock>) => void;
}

const Sep = ({ children }: { children: string }) => (
  <Text as="span" fontSize="sm" color="fg.muted">
    {children}
  </Text>
);

/**
 * Les réglages d'un bloc, éditables là où ils se lisent — dans l'en-tête.
 *
 * Quatre formes seulement : rien · une valeur · des valeurs composées · une
 * séquence. L'état d'édition reprend exactement les mots de l'état de lecture,
 * seuls les nombres s'encadrent. Jamais de popover, jamais de modale.
 */
export const BlockConfigInline = ({
  block,
  onUpdate,
}: BlockConfigInlineProps) => {
  switch (block.type) {
    // ── Rien à régler ──
    case 'warmup':
    case 'classic':
      return null;

    // ── Une valeur ──
    case 'emom':
      return (
        <InlineValue
          value={block.rounds}
          onChange={(v) => onUpdate({ rounds: v })}
          suffix="tours"
          emptyLabel="sans limite"
          ariaLabel="Nombre de tours"
          min={1}
          clearable
        />
      );
    case 'amrap':
      return (
        <InlineValue
          value={block.durationMinutes}
          onChange={(v) => onUpdate({ durationMinutes: v })}
          suffix="min"
          emptyLabel="sans limite"
          ariaLabel="Durée en minutes"
          min={1}
          clearable
        />
      );
    case 'timecap':
    case 'chipper':
      return (
        <HStack gap={1}>
          <InlineValue
            value={block.durationMinutes}
            onChange={(v) => onUpdate({ durationMinutes: v })}
            suffix="min"
            emptyLabel="sans limite"
            ariaLabel="Limite de temps en minutes"
            min={1}
            clearable
          />
          {block.durationMinutes !== undefined && <Sep>max</Sep>}
        </HStack>
      );

    // ── Valeurs composées ──
    case 'every':
      return (
        <HStack gap={1}>
          <InlineValue
            value={block.intervalMinutes}
            onChange={(v) => onUpdate({ intervalMinutes: v })}
            suffix="min"
            emptyLabel="—"
            ariaLabel="Intervalle en minutes"
            min={1}
          />
          <Sep>×</Sep>
          <InlineValue
            value={block.rounds}
            onChange={(v) => onUpdate({ rounds: v })}
            emptyLabel="—"
            ariaLabel="Nombre de tours"
            min={1}
          />
        </HStack>
      );
    case 'tabata':
    case 'onoff':
      return (
        <HStack gap={1}>
          <InlineValue
            value={block.rounds}
            onChange={(v) => onUpdate({ rounds: v })}
            emptyLabel="—"
            ariaLabel="Nombre de tours"
            min={1}
          />
          <Sep>×</Sep>
          {/* Secondes, pas minutes : c'est ce que lit le minuteur du mode
              guidé, et c'est ce que corrige p11-8. */}
          <InlineValue
            value={block.workDuration}
            onChange={(v) => onUpdate({ workDuration: v })}
            suffix="s"
            emptyLabel="—"
            ariaLabel="Durée de travail en secondes"
            min={1}
          />
          <Sep>/</Sep>
          <InlineValue
            value={block.restDuration}
            onChange={(v) => onUpdate({ restDuration: v })}
            suffix="s"
            emptyLabel="—"
            ariaLabel="Durée de repos en secondes"
          />
        </HStack>
      );

    // ── Une séquence ──
    case 'pyramid':
    case 'ladder':
      return (
        <HStack gap={2} align="flex-start">
          <InlineSequence
            value={block.repsScheme}
            onChange={(v) => onUpdate({ repsScheme: v })}
            ariaLabel="Paliers de répétitions"
          />
          <HStack gap={1} flexShrink={0}>
            {/* « repos aucun » ne se dit pas : quand le réglage est vide, la
                valeur porte la phrase entière. */}
            {block.restBetweenRounds !== undefined && <Sep>repos</Sep>}
            <InlineValue
              value={block.restBetweenRounds}
              onChange={(v) => onUpdate({ restBetweenRounds: v })}
              suffix="s"
              emptyLabel="sans repos"
              ariaLabel="Repos entre paliers en secondes"
              width="72px"
              clearable
            />
          </HStack>
        </HStack>
      );
  }
};
