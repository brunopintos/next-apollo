import React, { useState } from "react";
import { withApollo } from "../lib/apollo";
import styled from "styled-components";

import { Typography, Container } from "@material-ui/core";

import MainHeader from "../components/MainHeader";
import Title from "../components/Title";

const Subtitle = styled(Typography)`
  && {
    margin: 0;
    width: 100%;
    padding-top: 20px;
    text-align: center;
  }
`;

const Welcome = () => {
  const email = useFormInput("");
  const password = useFormInput("");

  return (
    <Container>
      <MainHeader title="KB - Knowledge Base" />
      <Title variant="h3">Wellcome to KB!</Title>
      <Subtitle variant="h6">Knowledge Base App</Subtitle>
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

export default withApollo(Welcome);
