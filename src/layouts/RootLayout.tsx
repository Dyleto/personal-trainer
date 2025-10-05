import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box, Grid } from "@chakra-ui/react";

const RootLayout: React.FC = () => {
  return (
    <Grid
      bg={"blackAlpha.800"}
      color={"whiteAlpha.900"}
      templateAreas={{ base: `'content' ` }}
      gridTemplateRows={{ base: "1fr" }}
      minH="100vh"
    >
      <Box gridArea={"content"}>
        <Outlet />
      </Box>
    </Grid>
  );
};

export default RootLayout;
