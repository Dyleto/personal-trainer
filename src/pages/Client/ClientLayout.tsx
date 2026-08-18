import { Outlet } from 'react-router-dom';
import {
  useClientSessions,
  ClientTabBar,
  ClientNavRail,
} from '@/features/client';
import { Header } from '@/components/Header';
import { Box, Flex, HStack } from '@chakra-ui/react';

const ClientLayout = () => {
  const clientSessions = useClientSessions();

  return (
    <Flex minH="100vh">
      <ClientNavRail />
      <Box flex={1} pb={{ base: '70px', md: 0 }}>
        <HStack justify="flex-end" p={4} display={{ base: 'flex', md: 'none' }}>
          <Header />
        </HStack>
        <Outlet context={clientSessions} />
        <ClientTabBar />
      </Box>
    </Flex>
  );
};

export default ClientLayout;
