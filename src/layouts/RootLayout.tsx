import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box, Grid } from "@chakra-ui/react";

const RootLayout: React.FC = () => {
  return (
    <Grid
      bg={"bg.muted"}
      color={"fg"}
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
