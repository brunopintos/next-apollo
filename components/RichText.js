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
import Button from "@material-ui/core/Button";
import NextLink from "next/link";
import styled from "styled-components";
import gql from "graphql-tag";
import moment from "moment";

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

const UPDATE_ARTICLE = gql`
  mutation updateArticle($newContent: String!, $articleId: ID!) {
    updateArticle(input: { newContent: $newContent, articleId: $articleId }) {
      id
      updatedAt
    }
  }
`;

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

const RichText = ({ article }) => {
  const [updateArticle] = useMutation(UPDATE_ARTICLE);
  const [updatedTime, setUpdatedTime] = useState(
    article?.updatedAt !== article?.createdAt ? article?.updatedAt : null
  );
  const [lastModificationTime, setLastModificationTime] = useState(
    moment(updatedTime).fromNow()
  );
  useEffect(() => {
    setLastModificationTime(moment(updatedTime).fromNow());
    setUpdatedTime(
      article?.updatedAt !== article?.createdAt ? article?.updatedAt : null
    );
    const timeOut = setInterval(() => {
      console.log("esto corre y el valor es este:");
      console.log(updatedTime);
      console.log("^^^^^^");
      console.log(moment(updatedTime).fromNow());
      setLastModificationTime(moment(updatedTime).fromNow());
    }, 15 * 1000);
    return () => {
      clearInterval(timeOut);
    };
  }, [updatedTime, article?.updatedAt]);

  const onSave = newContent => {
    updateArticle({
      variables: {
        newContent: newContent,
        articleId: article?.id
      }
    }).then(data => {
      setUpdatedTime(data.data.updateArticle.updatedAt);
      console.log("mostrame si cambio el tiempo");
      console.log(updatedTime);
    });
  };

  return (
    <StyledContainer>
      <TopBar>
        {!lastModificationTime.includes("Invalid") && (
          <NextLink
            href="/modifications/article/[article]"
            as={`/modifications/article/${article?.title}-${article?.id}`}
          >
            <StyledButton color="secondary">
              Last modified {lastModificationTime}
            </StyledButton>
            }
          </NextLink>
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
        saveInterval={300}
        valueTemplate={article?.content}
      >
        <Inject
          services={[Count, Image, Link, QuickToolbar, HtmlEditor, Toolbar]}
        />
      </RichTextEditorComponent>
    </StyledContainer>
  );
};

export default RichText;
