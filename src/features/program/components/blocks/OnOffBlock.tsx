import { HStack } from '@chakra-ui/react';
import { NumField } from './shared/NumField';
import { BlockShell } from './shared/BlockShell';
import { BlockProps } from './shared/types';

export const OnOffBlock = (props: BlockProps) => (
  <BlockShell
    {...props}
    configNode={
      props.isEditing && (
        <HStack gap={3}>
          <NumField
            label="Tours"
            value={props.block.rounds}
            min={1}
            onChange={(v) => props.onUpdate?.({ rounds: v })}
          />
          <NumField
            label="On (min)"
            value={props.block.workDuration}
            min={1}
            onChange={(v) => props.onUpdate?.({ workDuration: v })}
          />
          <NumField
            label="Off (min)"
            value={props.block.restDuration}
            min={1}
            onChange={(v) => props.onUpdate?.({ restDuration: v })}
          />
        </HStack>
      )
    }
  />
);
