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
import MaterialLink from "@material-ui/core/Link";
import styled from "styled-components";
import gql from "graphql-tag";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

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
    width: 80%;
    justify-content: space-between;
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

const ArticleContent = ({ article }) => {
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
    });
  };

  return (
    <StyledContainer>
      <TopBar>
        <Breadcrumbs maxItems={4} aria-label="breadcrumb">
          <NextLink
            color="inherit"
            href="/article/[article]"
            as="/article/adentroteimaginas-7"
          >
            breadcrumb2
          </NextLink>
          <Typography color="secondary">{article?.title}</Typography>
        </Breadcrumbs>
        {!lastModificationTime.includes("Invalid") && (
          <NextLink
            href="/modifications/article/[article]"
            as={`/modifications/article/${article?.title}-${article?.id}`}
          >
            <StyledButton color="secondary">
              Last modified {lastModificationTime}
            </StyledButton>
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

export default ArticleContent;
