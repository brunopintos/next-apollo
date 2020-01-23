import React, { useState } from "react";
import MainHeader from "../components/MainHeader";
import styled from "styled-components";
import { Typography, Container, Button } from "@material-ui/core";

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
const Subtitle = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    padding-top: 20px;
    text-align: center;
  }
`;

const Signup = () => {
  const email = useFormInput("");
  const password = useFormInput("");

  return (
    <CenteredContainer>
      <MainHeader />
      <Title variant="h3">Wellcome to KB!</Title>
      <Subtitle variant="h6">Knowledge Base App</Subtitle>
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
