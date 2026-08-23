import { BlockProps } from './shared/types';
import { WarmupBlock } from './WarmupBlock';
import { ClassicBlock } from './ClassicBlock';
import { EmomBlock } from './EmomBlock';
import { EveryBlock } from './EveryBlock';
import { AmrapBlock } from './AmrapBlock';
import { TimecapBlock } from './TimecapBlock';
import { ChipperBlock } from './ChipperBlock';
import { TabataBlock } from './TabataBlock';
import { OnOffBlock } from './OnOffBlock';
import { PyramidBlock } from './PyramidBlock';
import { LadderBlock } from './LadderBlock';

export type { BlockProps };

export const Block = (props: BlockProps) => {
  switch (props.block.type) {
    case 'warmup':
      return <WarmupBlock {...props} />;
    case 'classic':
      return <ClassicBlock {...props} />;
    case 'emom':
      return <EmomBlock {...props} />;
    case 'every':
      return <EveryBlock {...props} />;
    case 'amrap':
      return <AmrapBlock {...props} />;
    case 'timecap':
      return <TimecapBlock {...props} />;
    case 'chipper':
      return <ChipperBlock {...props} />;
    case 'tabata':
      return <TabataBlock {...props} />;
    case 'onoff':
      return <OnOffBlock {...props} />;
    case 'pyramid':
      return <PyramidBlock {...props} />;
    case 'ladder':
      return <LadderBlock {...props} />;
  }
};
