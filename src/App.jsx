import { Routes, Route, Link } from "react-router-dom";
import { Box, Flex, Button } from "@chakra-ui/react";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Box bg="blue.600" color="white" p={4}>
        <Button as={Link} to="/" colorScheme="blue" mr={2}>Dashboard</Button>
        <Button as={Link} to="/users" colorScheme="blue">Users</Button>
      </Box>
      <Box flex="1" p={4}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Box>
    </Flex>
  );
}

export default App;
