import { useState } from 'react';
import { NumberInput, Text, VStack } from '@chakra-ui/react';

interface NumFieldProps {
  label: string;
  value?: number;
  min?: number;
  onChange: (v: number) => void;
}

export const NumField = ({
  label,
  value,
  min = 0,
  onChange,
}: NumFieldProps) => {
  const [local, setLocal] = useState(value != null ? String(value) : '');
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocal(value != null ? String(value) : '');
  }

  return (
    <VStack align="start" gap={1} flex={1}>
      <Text
        fontSize="2xs"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <NumberInput.Root
        size="sm"
        value={local}
        min={min}
        variant="subtle"
        onValueChange={(e) => {
          setLocal(e.value);
          const n = parseInt(e.value);
          if (!isNaN(n)) onChange(n);
        }}
        onBlur={() => {
          if (local === '' || isNaN(parseInt(local))) {
            setLocal('0');
            onChange(0);
          }
        }}
      >
        <NumberInput.Input
          bg="whiteAlpha.100"
          _focus={{ bg: 'whiteAlpha.200' }}
          borderRadius="md"
          h="36px"
        />
        <NumberInput.Control>
          <NumberInput.IncrementTrigger />
          <NumberInput.DecrementTrigger />
        </NumberInput.Control>
      </NumberInput.Root>
    </VStack>
  );
};
