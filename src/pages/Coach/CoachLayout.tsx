import { Outlet } from 'react-router-dom';
import { CoachNavRail, CoachTabBar } from '@/features/coach';
import { MobileTopBar } from '@/components/MobileTopBar';
import { Box, Flex } from '@chakra-ui/react';

const CoachLayout = () => {
  return (
    <Flex minH="100vh">
      <CoachNavRail />
      <Box flex={1} minW={0} pb={{ base: '70px', md: 0 }}>
        <MobileTopBar />
        <Box as="main" id="contenu" minW={0}>
          <Outlet />
        </Box>
        <CoachTabBar />
      </Box>
    </Flex>
  );
};

export default CoachLayout;
