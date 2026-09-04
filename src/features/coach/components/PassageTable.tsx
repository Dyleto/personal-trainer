import { Box, HStack, Table, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { LuChevronDown } from 'react-icons/lu';
import { CompletedSession } from '@/types';
import { EFFORT_ZONE_COLOR, getEffortLevel } from '@/features/client/constants';
import { getRelativeDate } from '@/features/client';
import { hitArea } from '@/components/hitArea';
import { buildPassageColumns, passageValue } from '../passageColumns';

interface PassageTableProps {
  /** Déjà filtré sur cette séance, du plus récent au plus ancien. */
  history: CompletedSession[];
  onOpen?: (completed: CompletedSession) => void;
  limit?: number;
}

/**
 * Un passage par ligne : quand, ressenti, et la charge d'un exercice.
 *
 * Le ressenti et la charge sont deux moitiés d'un même jugement — « il trouve
 * ça dur » et « il est monté à 26 kg » — et le panneau les rangeait dans deux
 * blocs séparés. Ici on les lit sur la même ligne, et la corrélation se voit
 * en descendant les deux colonnes.
 *
 * Le tableau montre aussi les séances sans ressenti, que l'axe ne peut pas
 * placer : un tiret est une information, pas un trou.
 */
export const PassageTable = ({
  history,
  onOpen,
  limit = 5,
}: PassageTableProps) => {
  const columns = buildPassageColumns(history);
  // Le premier est le plus souvent renseigné : le meilleur défaut, celui qui
  // a le plus de points à comparer.
  const [columnIndex, setColumnIndex] = useState(0);
  const column = columns[columnIndex % Math.max(1, columns.length)];
  const rows = history.slice(0, limit);

  if (rows.length === 0) return null;

  return (
    <Table.Root size="sm" variant="line" interactive={!!onOpen}>
      <Table.Header>
        <Table.Row bg="transparent">
          <Table.ColumnHeader
            fontSize="9.5px"
            letterSpacing="wider"
            textTransform="uppercase"
            color="fg.muted"
            fontFamily="mono"
            px={0}
          >
            Quand
          </Table.ColumnHeader>
          <Table.ColumnHeader
            fontSize="9.5px"
            letterSpacing="wider"
            textTransform="uppercase"
            color="fg.muted"
            fontFamily="mono"
            px={0}
          >
            Ressenti
          </Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end" px={0}>
            {column && (
              /* Une lentille, pas un choix figé : le coach sait quel mouvement
                 compte sur cette séance. L'exercice étant fixe pour toute la
                 colonne, l'unité l'est aussi — jamais de kilos et de
                 répétitions mélangés. */
              <Box
                as={columns.length > 1 ? 'button' : undefined}
                aria-label={
                  columns.length > 1
                    ? `Colonne : ${column.name}. Changer d'exercice.`
                    : undefined
                }
                onClick={
                  columns.length > 1
                    ? () => setColumnIndex((i) => (i + 1) % columns.length)
                    : undefined
                }
                css={columns.length > 1 ? hitArea(32) : undefined}
              >
                <HStack gap={1} justify="flex-end">
                  <Text
                    fontSize="9.5px"
                    letterSpacing="wider"
                    textTransform="uppercase"
                    fontFamily="mono"
                    color={columns.length > 1 ? 'app.primary' : 'fg.muted'}
                    lineClamp={1}
                  >
                    {column.name} · {column.unit}
                  </Text>
                  {columns.length > 1 && (
                    <Box color="app.primary" opacity={0.7} flexShrink={0}>
                      <LuChevronDown size={10} />
                    </Box>
                  )}
                </HStack>
              </Box>
            )}
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {rows.map((completed) => {
          const level = getEffortLevel(completed.feedback?.effort);
          const value = column ? passageValue(completed, column) : undefined;

          return (
            <Table.Row
              key={completed._id}
              bg="transparent"
              cursor={onOpen ? 'pointer' : undefined}
              onClick={onOpen ? () => onOpen(completed) : undefined}
            >
              <Table.Cell px={0} color="fg.muted" whiteSpace="nowrap">
                {getRelativeDate(completed.completedAt)}
              </Table.Cell>
              <Table.Cell
                px={0}
                color={level ? EFFORT_ZONE_COLOR[level.zone] : 'fg.muted'}
              >
                {level?.label ?? '—'}
              </Table.Cell>
              <Table.Cell
                px={0}
                textAlign="end"
                fontFamily="mono"
                color={value === undefined ? 'fg.muted' : 'fg'}
              >
                {value ?? '—'}
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};
