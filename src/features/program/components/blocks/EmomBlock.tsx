import { NumField } from "./shared/NumField";
import { BlockShell } from "./shared/BlockShell";
import { BlockProps } from "./shared/types";

export const EmomBlock = (props: BlockProps) => (
  <BlockShell
    {...props}
    configNode={
      props.isEditing && (
        <NumField
          label="Durée (min)"
          value={props.block.durationMinutes}
          min={1}
          onChange={(v) => props.onUpdate?.({ durationMinutes: v })}
        />
      )
    }
  />
);
