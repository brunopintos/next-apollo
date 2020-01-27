import React, { useState } from "react";
import { withApollo } from "../apollo";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

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
    <Container>
      <MainHeader title="KB - Knowledge Base" />
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
            id="outlined-password-input"
            label="Password"
            type="password"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <StyledButton
            aria-label="Continue"
            onClick={() => {
              //validar que no exista y registrarme
              //
              //
              //ir a la welcome page
            }}
          >
            Continue
          </StyledButton>
        </Grid>
      </StyledGrid>
    </Container>
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

export default withApollo(Signup);
