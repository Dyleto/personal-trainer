import { HStack, Text, Box } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { LuStar } from 'react-icons/lu';

interface MetricStarsProps {
  icon: ReactNode;
  label: string;
  value: number; // 1-5
  readonly?: boolean;
  onChange?: (value: number) => void;
  starsW?: string;
}

export const MetricStars = ({
  icon,
  label,
  value,
  readonly = false,
  onChange,
  starsW,
}: MetricStarsProps) => {
  return (
    <HStack justify="space-between" w="full">
      <HStack gap={2} minW="130px">
        {icon}
        <Text fontSize="sm" color="fg.muted">
          {label}
        </Text>
      </HStack>
      <HStack
        gap={1}
        w={starsW}
        justify={starsW ? 'space-between' : undefined}
        role={readonly ? undefined : 'group'}
        aria-label={readonly ? undefined : label}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Box
            key={star}
            role={readonly ? undefined : 'button'}
            tabIndex={readonly ? undefined : 0}
            aria-label={readonly ? undefined : `Noter ${star} sur 5`}
            aria-pressed={readonly ? undefined : star === value}
            display="flex"
            cursor={readonly ? 'default' : 'pointer'}
            onClick={() => !readonly && onChange?.(star)}
            onKeyDown={(e) => {
              if (readonly) return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onChange?.(star);
              }
            }}
            _focusVisible={
              readonly
                ? undefined
                : {
                    outline: '2px solid',
                    outlineColor: 'app.primary',
                    outlineOffset: '2px',
                    borderRadius: 'sm',
                  }
            }
          >
            <LuStar
              size={18}
              color={
                star <= value
                  ? 'var(--chakra-colors-app-primary)'
                  : 'rgba(255,255,255,0.15)'
              }
              fill={
                star <= value
                  ? 'var(--chakra-colors-app-primary)'
                  : 'transparent'
              }
              style={{ transition: 'color 0.15s, transform 0.15s' }}
            />
          </Box>
        ))}
      </HStack>
    </HStack>
  );
};
