import { Outlet } from 'react-router-dom';
import {
  useClientSessions,
  ClientTabBar,
  ClientNavRail,
} from '@/features/client';
import { MobileTopBar } from '@/components/MobileTopBar';
import { Box, Flex } from '@chakra-ui/react';

const ClientLayout = () => {
  const clientSessions = useClientSessions();

  return (
    <Flex minH="100vh">
      <ClientNavRail />
      <Box flex={1} minW={0} pb={{ base: '70px', md: 0 }}>
        <MobileTopBar />
        <Outlet context={clientSessions} />
        <ClientTabBar />
      </Box>
    </Flex>
  );
};

export default ClientLayout;
