import { useGenerateInvitation } from '@/features/coach/hooks/useGenerateInvitation';
import { Button, useClipboard } from '@chakra-ui/react';
import { useEffect } from 'react';

export const InvitationBlock = () => {
  const { mutate, data, isPending } = useGenerateInvitation();
  const invitationLink = data?.link ?? '';

  const clipboard = useClipboard({
    value: invitationLink,
    timeout: 1500,
  });

  // Copier automatiquement quand le lien est généré
  useEffect(() => {
    if (invitationLink) {
      clipboard.copy();
    }
  }, [invitationLink, clipboard]);

  const handleClick = () => {
    mutate(); // ✅ Génère un nouveau lien à chaque clic
  };

  return (
    <Button
      bg={clipboard.copied ? 'app.success' : 'app.primary'}
      color="fg.inverted"
      _hover={{
        bg: clipboard.copied ? 'app.success.hover' : 'app.primary.hover',
        transform: 'translateY(-2px)',
        boxShadow: 'md',
      }}
      _active={{
        bg: clipboard.copied ? 'app.success.active' : 'app.primary.active',
        boxShadow: 'sm',
      }}
      pointerEvents={clipboard.copied ? 'none' : 'auto'}
      width="15em"
      onClick={handleClick}
      loading={isPending}
    >
      {clipboard.copied ? '✓ Lien copié !' : "Copier le lien d'invitation"}
    </Button>
  );
};
