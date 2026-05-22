import { SessionBlock } from "@/types";
import { Block } from "./blocks";

interface BlockCardProps {
  block: SessionBlock;
}

export const BlockCard = ({ block }: BlockCardProps) => (
  <Block block={block} isEditing={false} />
);
