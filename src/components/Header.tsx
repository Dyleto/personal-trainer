import { useAuth } from '@/contexts/useAuth';
import { Box, Menu, Avatar, Portal, HStack, Text } from '@chakra-ui/react';
import {
  LuDumbbell,
  LuWrench,
  LuLogOut,
  LuClipboardCheck,
} from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  variant?: 'rail' | 'compact';
}

export const Header = ({ variant = 'compact' }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roles = [user?.isClient, user?.isCoach, user?.isAdmin].filter(Boolean);
  const hasMultipleRoles = roles.length > 1;
  const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleSwitchClientView = () => {
    navigate('/client', { replace: true });
  };

  const handleSwitchAdminView = () => {
    navigate('/admin', { replace: true });
  };

  const handleSwitchCoachView = () => {
    navigate('/coach', { replace: true });
  };

  const avatar = (
    <Avatar.Root size={variant === 'rail' ? 'sm' : 'md'} cursor="pointer">
      <Avatar.Fallback name={fullName} />
      <Avatar.Image src={user?.picture} />
    </Avatar.Root>
  );

  return (
    <Box zIndex={2}>
      <Menu.Root positioning={{ placement: 'bottom-end' }}>
        <Menu.Trigger asChild>
          {variant === 'rail' ? (
            <HStack
              role="group"
              cursor="pointer"
              gap={2.5}
              px={2}
              py={3}
              mt={2}
              borderTopWidth="1px"
              borderColor="whiteAlpha.100"
              color="fg.muted"
              _hover={{ color: 'app.primary' }}
              transition="color 0.15s"
            >
              {avatar}
              <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
                {user?.firstName}
              </Text>
            </HStack>
          ) : (
            <Box role="group" cursor="pointer" w="fit-content">
              {avatar}
            </Box>
          )}
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              {hasMultipleRoles && (
                <>
                  {user?.isClient && (
                    <Menu.Item
                      value="change-client"
                      cursor="pointer"
                      onClick={handleSwitchClientView}
                    >
                      <HStack gap={2}>
                        <LuDumbbell /> <Text>Vue Client</Text>
                      </HStack>
                    </Menu.Item>
                  )}
                  {user?.isCoach && (
                    <Menu.Item
                      value="change-coach"
                      cursor="pointer"
                      onClick={handleSwitchCoachView}
                    >
                      <HStack gap={2}>
                        <LuClipboardCheck /> <Text>Vue Coach</Text>
                      </HStack>
                    </Menu.Item>
                  )}
                  {user?.isAdmin && (
                    <Menu.Item
                      value="change-admin"
                      cursor="pointer"
                      onClick={handleSwitchAdminView}
                    >
                      <HStack gap={2}>
                        <LuWrench /> <Text>Vue Admin</Text>
                      </HStack>
                    </Menu.Item>
                  )}

                  {(user?.isClient || user?.isCoach || user?.isAdmin) && (
                    <Menu.Separator />
                  )}
                </>
              )}
              <Menu.Item
                value="logout"
                onClick={handleLogout}
                color="fg.error"
                cursor="pointer"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <HStack gap={2}>
                  <LuLogOut />
                  <Text>Déconnexion</Text>
                </HStack>
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Box>
  );
};
