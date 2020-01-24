import React, { useState } from "react";
import styled from "styled-components";
import Link from "next/link";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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

const Login = () => {
  const email = useFormInput("");
  const password = useFormInput("");

  return (
    <Container>
      <MainHeader title="KB - Knowledge Base" />
      <Title variant="h3">Log In</Title>
      <StyledGrid container direction="column" spacing={3} alignItems="center">
        <Grid item>
          <StyledTextField {...email} label="Email" variant="outlined" />
        </Grid>
        <Grid item>
          <StyledTextField
            {...password}
            label="Password"
            type="password"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <StyledButton
            aria-label="Continue"
            onClick={() => {
              //validar que exista y logearme
              //
              //
              //ir a la welcome page
            }}
          >
            Continue
          </StyledButton>
        </Grid>
        <Grid item>
          <Typography variant="h6">Don't have an account? </Typography>
          <Typography variant="h6">
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </Typography>
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

export default Login;
