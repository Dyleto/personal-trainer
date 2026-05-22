import { NumField } from "./shared/NumField";
import { BlockShell } from "./shared/BlockShell";
import { BlockProps } from "./shared/types";

export const ChipperBlock = (props: BlockProps) => (
  <BlockShell
    {...props}
    configNode={
      props.isEditing && (
        <NumField
          label="Time cap (min, 0 = sans limite)"
          value={props.block.durationMinutes ?? 0}
          onChange={(v) => props.onUpdate?.({ durationMinutes: v || undefined })}
        />
      )
    }
  />
);
