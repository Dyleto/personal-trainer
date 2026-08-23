import { Grid, Text, Box, HStack } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface MetricScaleProps {
  icon: ReactNode;
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number; // 1-5
  readonly?: boolean;
  onChange?: (value: number) => void;
}

export const MetricScale = ({
  icon,
  label,
  lowLabel,
  highLabel,
  value,
  readonly = false,
  onChange,
}: MetricScaleProps) => {
  return (
    <Grid
      templateColumns="1fr 54px auto 60px"
      alignItems="center"
      columnGap={2}
      w="full"
    >
      <HStack gap={2}>
        {icon}
        <Text fontSize="sm" color="fg.muted">
          {label}
        </Text>
      </HStack>

      <Text
        fontSize="2xs"
        color="fg.muted"
        textAlign="right"
        whiteSpace="nowrap"
      >
        {lowLabel}
      </Text>

      <HStack
        gap={1}
        role={readonly ? undefined : 'group'}
        aria-label={readonly ? undefined : label}
      >
        {[1, 2, 3, 4, 5].map((level) => (
          <Box
            key={level}
            role={readonly ? undefined : 'button'}
            tabIndex={readonly ? undefined : 0}
            aria-label={readonly ? undefined : `${label} : ${level} sur 5`}
            aria-pressed={readonly ? undefined : level === value}
            w="15px"
            h="17px"
            borderRadius="sm"
            bg={level <= value ? 'app.primary' : 'rgba(255,255,255,0.15)'}
            cursor={readonly ? 'default' : 'pointer'}
            onClick={() => !readonly && onChange?.(level)}
            onKeyDown={(e) => {
              if (readonly) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange?.(level);
              }
            }}
            _focusVisible={
              readonly
                ? undefined
                : {
                    outline: '2px solid',
                    outlineColor: 'app.primary',
                    outlineOffset: '2px',
                  }
            }
            transition="background-color 0.15s"
          />
        ))}
      </HStack>

      <Text fontSize="2xs" color="fg.muted" whiteSpace="nowrap">
        {highLabel}
      </Text>
    </Grid>
  );
};
