import { HStack } from "@chakra-ui/react";
import { NumField } from "./shared/NumField";
import { BlockShell } from "./shared/BlockShell";
import { BlockProps } from "./shared/types";

export const EveryBlock = (props: BlockProps) => (
  <BlockShell
    {...props}
    configNode={
      props.isEditing && (
        <HStack gap={3}>
          <NumField
            label="Toutes les (min)"
            value={props.block.intervalMinutes}
            min={1}
            onChange={(v) => props.onUpdate?.({ intervalMinutes: v })}
          />
          <NumField
            label="Tours"
            value={props.block.rounds}
            min={1}
            onChange={(v) => props.onUpdate?.({ rounds: v })}
          />
        </HStack>
      )
    }
  />
);
