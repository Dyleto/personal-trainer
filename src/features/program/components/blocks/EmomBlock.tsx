import { NumField } from './shared/NumField';
import { BlockShell } from './shared/BlockShell';
import { BlockProps } from './shared/types';

export const EmomBlock = (props: BlockProps) => (
  <BlockShell
    {...props}
    configNode={
      props.isEditing && (
        <NumField
          label="Tours"
          value={props.block.rounds}
          min={1}
          onChange={(v) => props.onUpdate?.({ rounds: v })}
        />
      )
    }
  />
);
