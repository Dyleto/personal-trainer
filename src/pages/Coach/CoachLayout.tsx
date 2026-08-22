import { Outlet } from 'react-router-dom';
import { CoachNavRail, CoachTabBar } from '@/features/coach';
import { Header } from '@/components/Header';
import { Box, Flex, HStack } from '@chakra-ui/react';

const CoachLayout = () => {
  return (
    <Flex minH="100vh">
      <CoachNavRail />
      <Box flex={1} pb={{ base: '70px', md: 0 }}>
        <HStack justify="flex-end" p={4} display={{ base: 'flex', md: 'none' }}>
          <Header />
        </HStack>
        <Outlet />
        <CoachTabBar />
      </Box>
    </Flex>
  );
};

export default CoachLayout;
