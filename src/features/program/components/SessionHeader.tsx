import { Box, HStack } from '@chakra-ui/react';

interface SessionHeaderProps {
  order: number;
}

export const SessionHeader = ({ order }: SessionHeaderProps) => {
  return (
    <HStack justify="center" align="center" p={{ base: 4, md: 6 }}>
      <Box
        px={4}
        py={2}
        borderRadius="full"
        bg="app.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        fontSize="lg"
        color="bg.canvas"
        boxShadow={`0 4px 12px var(--chakra-colors-app-primary)4D`}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          inset: '-3px',
          borderRadius: 'full',
          padding: '3px',
          background: `linear-gradient(135deg, var(--chakra-colors-app-primary)66, var(--chakra-colors-app-primary)1A)`,
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      >
        Séance {order}
      </Box>
    </HStack>
  );
};
