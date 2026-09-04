import { useCallback, useState } from 'react';
import { Box, Button, Container, HStack, Text, VStack } from '@chakra-ui/react';
import { LuCheck, LuUserPlus } from 'react-icons/lu';
import { ClientsList, COACH_CONTENT_MAX_W } from '@/features/coach';
import { useClients } from '@/features/coach/hooks/useClients';
import { useGenerateInvitation } from '@/features/coach/hooks/useGenerateInvitation';
import { useActiveInvitation } from '@/features/coach/hooks/useActiveInvitation';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/config/queryKeys';
import { hitArea } from '@/components/hitArea';
import { toaster } from '@/components/ui/toasterInstance';

const Clients = () => {
  const { data: clients = [] } = useClients();
  const { mutate: generateInvitation, isPending } = useGenerateInvitation();
  const { data: activeInvitation } = useActiveInvitation();
  const queryClient = useQueryClient();
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      toaster.create({
        title: "Lien d'invitation copié",
        description: 'Envoyez-le à votre client : il rejoindra votre suivi.',
        type: 'success',
      });
    } catch {
      // Presse-papier refusé (contexte non sécurisé, permission) : on
      // montre le lien plutôt que de laisser croire qu'il est copié.
      toaster.create({
        title: "Lien d'invitation",
        description: link,
        type: 'info',
        duration: 20000,
      });
    }
  }, []);

  /**
   * Inviter, c'est une seule action : fabriquer un lien et le copier.
   *
   * Elle passait par un tiroir latéral dont le corps entier était un bouton
   * — deux clics et un panneau pour une opération qui n'a aucun réglage. Le
   * bouton fait maintenant ce qu'il annonce.
   *
   * La copie est explicite plutôt que confiée à `useClipboard` : celui-ci
   * passe par une machine à états, et rien ne garantit que le `copy()` voie
   * la valeur posée juste avant. Un lien d'invitation copié vide ne se
   * remarque qu'au moment où le client dit qu'il n'a rien reçu.
   */
  const invite = () => {
    generateInvitation(undefined, {
      onSuccess: ({ link }) => {
        copy(link);
        queryClient.invalidateQueries({
          queryKey: queryKeys.coach.invitation(),
        });
      },
    });
  };

  return (
    <Container maxW={COACH_CONTENT_MAX_W} py={8} px={4}>
      <VStack align="stretch" gap={6}>
        <HStack justify="space-between" align="center" gap={3}>
          <VStack align="start" gap={0} minW={0}>
            <Text as="h1" fontWeight="bold" fontSize="lg">
              Mes clients
            </Text>
            {clients.length > 0 && (
              <Text fontSize="xs" color="fg.muted">
                {clients.length} client{clients.length > 1 ? 's' : ''}
              </Text>
            )}
          </VStack>
          <Button
            size="sm"
            flexShrink={0}
            bg={isCopied ? 'app.success' : 'app.primary'}
            color="bg.canvas"
            fontWeight="bold"
            _hover={{
              bg: isCopied ? 'app.success.hover' : 'app.primary.hover',
            }}
            onClick={invite}
            loading={isPending}
          >
            {isCopied ? (
              <>
                <LuCheck /> Lien copié
              </>
            ) : (
              <>
                <LuUserPlus /> Inviter
              </>
            )}
          </Button>
        </HStack>

        {/* Le lien survit au message de confirmation.
            Il ne dit pas qui a été invité — l'API recycle un même lien par
            coach, elle ne sait pas à qui il a été envoyé — mais il cesse
            d'être perdu dès qu'on ferme le toast. */}
        {activeInvitation && (
          <HStack
            gap={2}
            fontSize="xs"
            color="fg.muted"
            mt={-4}
            flexWrap="wrap"
          >
            <Text>
              Lien d'invitation actif jusqu'au{' '}
              {new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
              }).format(new Date(activeInvitation.expiresAt))}
            </Text>
            <Box
              as="button"
              color="app.primary"
              fontWeight="medium"
              onClick={() =>
                copy(
                  `${window.location.origin}/join?token=${activeInvitation.token}`
                )
              }
              _focusVisible={{
                outline: '2px solid',
                outlineColor: 'app.primary',
                outlineOffset: '2px',
              }}
              css={hitArea(32)}
            >
              Recopier
            </Box>
          </HStack>
        )}

        <ClientsList />
      </VStack>
    </Container>
  );
};

export default Clients;
