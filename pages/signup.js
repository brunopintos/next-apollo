import React, { useState } from "react";
import { withApollo } from "../lib/apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

const SIGNUP_USER = gql`
  mutation CreateUsers($email: String!, $password: String!) {
    signupUser(email: $email, password: $password) {
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

const Signup = () => {
  const email = useFormInput("");
  const password = useFormInput("");
  const passwordConfirmation = useFormInput("");
  const [signupUser, { data }] = useMutation(SIGNUP_USER);
  const router = useRouter();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  return (
    <Container>
      <MainHeader title="KB - Knowledge Base" />
      <Title variant="h3">Sign Up</Title>
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
          <StyledTextField
            {...passwordConfirmation}
            label="Confirm Password"
            type="password"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <StyledButton
            aria-label="Continue"
            href={"/"}
            onClick={e => {
              e.preventDefault();
              if (password.value === passwordConfirmation.value) {
                signupUser({
                  variables: { email: email.value, password: password.value }
                }).then(data => {
                  console.log(data);
                  if (data) {
                    enqueueSnackbar(
                      `User ${email.value} created successfully!!`,
                      {
                        variant: "success"
                      }
                    );
                    router.push("/onboarding");
                  } else {
                    enqueueSnackbar("Oops! Something went wrong.", {
                      variant: "error"
                    });
                  }
                });
              } else {
                enqueueSnackbar("The passwords don`t match.", {
                  variant: "error"
                });
              }
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
