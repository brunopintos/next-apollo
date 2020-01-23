import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import MainHeader from "../components/MainHeader";
import styled from "styled-components";
import { Typography, Container, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const CenteredContainer = styled(Container)``;

const Title = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    padding-top: 100px;
    text-align: center;
    font-weight: bold;
  }
`;

const StyledTextField = styled(TextField)``;

const StyledGrid = styled(Grid)`
  && {
    padding-top: 20px;
  }
`;

const StyledButton = styled(Button)`
  && {
    background-color: Gold;
  }
`;

const Signup = () => {
  const email = useFormInput("");
  const password = useFormInput("");

  return (
    <CenteredContainer>
      <MainHeader />
      <Title variant="h3">Sign Up</Title>
      <StyledGrid container direction="column" spacing={3} alignItems="center">
        <Grid item>
          <StyledTextField
            {...email}
            id="outlined-basic"
            label="Email"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <StyledTextField
            {...password}
            id="outlined-basic"
            label="Password"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <StyledButton
            aria-label="Continue"
            onClick={() => {
              //validar que no exista, registrarme e ir a la welcome page
            }}
          >
            Continue
          </StyledButton>
        </Grid>
      </StyledGrid>
    </CenteredContainer>
  );
};

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  return {
    value,
    onChange: handleChange
  };
}

export default Signup;
