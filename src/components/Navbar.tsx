import { Box, Grid } from "@chakra-ui/react";

const Navbar: React.FC = () => {
  return (
    <Grid
      h="100%"
      bg="yellow.400"
      templateColumns={"1fr 1fr 1fr 1fr 1fr"}
      justifyItems={"center"}
      alignItems="center"
      gap={4}
      borderTopStartRadius={"3xl"}
      borderTopEndRadius={"3xl"}
    >
      <Box
        fontWeight="bold"
        bg="blackAlpha.800"
        color="yellow.400"
        textAlign="center"
        borderRadius={"100%"}
        width="3rem"
        height="3rem"
      >
        1
      </Box>
      <Box fontWeight="bold">2</Box>
      <Box fontWeight="bold">3</Box>
      <Box fontWeight="bold">4</Box>
      <Box fontWeight="bold">5</Box>
    </Grid>
  );
};

export default Navbar;
