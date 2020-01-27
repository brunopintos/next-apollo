import React, { useState } from "react";
import { withApollo } from "../lib/apollo";
import styled from "styled-components";
import Link from "next/link";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      password
    }
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

const LittleText = styled(Typography)`
  && {
    font-size: 14px;
  }
`;

const Login = () => {
  const email = useFormInput("");
  const password = useFormInput("");
  const [login, { data }] = useMutation(LOGIN);

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
              login({
                variables: { email: email.value, password: password.value }
              });
              console.log(`User ${email.value} logged in successfully!!`);
              email.value = "";
              password.value = "";
            }}
          >
            Continue
          </StyledButton>
        </Grid>
        <Grid item>
          <LittleText variant="h6">
            Don't have an account?{" "}
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </LittleText>
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

export default withApollo(Login);
