/**
 * Initilaize RichTextEditor from React element
 */
import {
  RichTextEditorComponent,
  Inject,
  QuickToolbar,
  Image,
  Link,
  HtmlEditor,
  Toolbar,
  Count
} from "@syncfusion/ej2-react-richtexteditor";
import * as React from "react";
import { useMutation } from "@apollo/react-hooks";
import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import gql from "graphql-tag";

const StyledButton = styled(Button)`
  && {
    display: flex;
    text-transform: none;
  }
`;
const TopBar = styled.div`
  && {
    display: flex;
    position: fixed;
    left: 0;
    top: 75px;
    z-index: 1050;
    width: 100%;
    justify-content: flex-end;
    padding-left: 255px;
    padding-right: 20px;
    background-color: #fff;
  }
`;
const StyledContainer = styled.div`
  && {
    padding-top: 60px;
  }
`;

const CREATE_MODIFICATION = gql`
  mutation createModification($newContent: String!, $articleId: ID!) {
    createModification(
      input: { newContent: $newContent, articleId: $articleId }
    ) {
      id
      createdAt
    }
  }
`;

const RichText = ({ updatedAt, articleId, content }) => {
  const [createModification, { data }] = useMutation(CREATE_MODIFICATION);
  const [updatedTime, setUpdatedTime] = useState(updatedAt);

  const inlineMode = {
    enable: true,
    onSelection: true
  };
  const format = {
    width: "auto"
  };
  const fontFamily = {
    width: "auto"
  };
  const toolbarSettings = {
    enable: true,
    items: [
      "Formats",
      "Alignments",
      "OrderedList",
      "UnorderedList",
      "|",
      "FontName",
      "FontColor",
      "FontSize",
      "BackgroundColor",
      "-",
      "Bold",
      "Italic",
      "Underline",
      "StrikeThrough",
      "|",
      "CreateLink",
      "Image",
      "|",
      "SubScript",
      "SuperScript",
      "|",
      "Print",
      "SourceCode"
    ]
  };

  const calculateModificationTime = () => {
    if (!updatedTime) {
      return null;
    }
    const difference = +new Date() - updatedTime;
    let modificationTime = {};
    if (difference > 0) {
      modificationTime = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return modificationTime;
  };

  const [modificationTime, setModificationTime] = useState(
    calculateModificationTime()
  );
  useEffect(() => {
    setTimeout(() => {
      setModificationTime(calculateModificationTime());
    }, 1000);
  });

  const onSave = newContent => {
    createModification({
      variables: {
        newContent: newContent,
        articleId: articleId
      }
    }).then(data => {
      setUpdatedTime(data.data.createModification.createdAt);
    });
  };

  const getNiceTime = () => {
    if (modificationTime.days) {
      return `${modificationTime.days} day${
        modificationTime.days > 1 ? "s" : ""
      }`;
    }
    if (modificationTime.hours) {
      return `${modificationTime.hours} hour${
        modificationTime.hours > 1 ? "s" : ""
      }`;
    }
    if (modificationTime.minutes) {
      return `${modificationTime.minutes} minute${
        modificationTime.minutes > 1 ? "s" : ""
      }`;
    }
    if (modificationTime.seconds) {
      return `seconds`;
    }
  };

  return (
    <StyledContainer>
      <TopBar>
        {modificationTime ? (
          <StyledButton color="secondary">
            Modified {getNiceTime()} ago
          </StyledButton>
        ) : (
          <></>
        )}
      </TopBar>
      <RichTextEditorComponent
        id="inlineRTE"
        enableResize={false}
        enableTabKey={true}
        inlineMode={inlineMode}
        locale={"es-AR"}
        toolbarSettings={toolbarSettings}
        format={format}
        showCharCount={true}
        fontFamily={fontFamily}
        change={valueTemplate => onSave(valueTemplate.value)}
        saveInterval={10000}
        valueTemplate={content}
      >
        <Inject
          services={[Count, Image, Link, QuickToolbar, HtmlEditor, Toolbar]}
        />
      </RichTextEditorComponent>
    </StyledContainer>
  );
};

export default RichText;
