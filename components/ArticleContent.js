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
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import gql from "graphql-tag";
import moment from "moment";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Tooltip from "@material-ui/core/Tooltip";

const GET_ARTICLE_WITH_PARENTS = gql`
  query getArticleWithParents($id: Id!) {
    getArticleWithParents(id: $id) {
      id
      title
      icon
      content
      createdAt
      updatedAt
    }
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

const StyledButton = styled(Button)`
  && {
    display: flex;
    text-transform: none;
  }
`;

const TitleTypography = styled(Typography)`
  && {
    color: #424242;
    font-weight: bold;
    padding-left: 16px;
    padding-right: 16px;
    padding-bot: 16px;
  }
`;

const ClickableText = styled.a`
  && {
    color: #424242;
  }
`;

const TopBar = styled.div`
  && {
    display: flex;
    position: fixed;
    left: 0;
    top: 64px;
    padding-top: 12px;
    z-index: 1050;
    width: 80%;
    justify-content: space-between;
    padding-left: 255px;
    padding-right: 20px;
    background-color: #fff;
  }
`;
const StyledContainer = styled.div``;

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

const ArticleContent = ({ articleId }) => {
  const articleWithParents = useQuery(GET_ARTICLE_WITH_PARENTS, {
    variables: { id: articleId }
  });
  const [updateArticle] = useMutation(UPDATE_ARTICLE);
  const [updatedTime, setUpdatedTime] = useState(
    articleWithParents.data?.getArticleWithParents[
      articleWithParents.data?.getArticleWithParents.length - 1
    ]?.updatedAt !==
      articleWithParents.data?.getArticleWithParents[
        articleWithParents.data?.getArticleWithParents.length - 1
      ]?.createdAt
      ? articleWithParents.data?.getArticleWithParents[
          articleWithParents.data?.getArticleWithParents.length - 1
        ]?.updatedAt
      : null
  );
  const [lastModificationTime, setLastModificationTime] = useState(
    moment(updatedTime).fromNow()
  );
  useEffect(() => {
    setLastModificationTime(moment(updatedTime).fromNow());
    setUpdatedTime(
      articleWithParents.data?.getArticleWithParents[
        articleWithParents.data?.getArticleWithParents.length - 1
      ]?.updatedAt !==
        articleWithParents.data?.getArticleWithParents[
          articleWithParents.data?.getArticleWithParents.length - 1
        ]?.createdAt
        ? articleWithParents.data?.getArticleWithParents[
            articleWithParents.data?.getArticleWithParents.length - 1
          ]?.updatedAt
        : null
    );
    const timeOut = setInterval(() => {
      setLastModificationTime(moment(updatedTime).fromNow());
    }, 15 * 1000);
    return () => {
      clearInterval(timeOut);
    };
  }, [
    updatedTime,
    articleWithParents.data?.getArticleWithParents[
      articleWithParents.data?.getArticleWithParents.length - 1
    ]?.updatedAt
  ]);

  const onSave = newContent => {
    updateArticle({
      variables: {
        newContent: newContent,
        articleId:
          articleWithParents.data?.getArticleWithParents[
            articleWithParents.data?.getArticleWithParents.length - 1
          ]?.id
      }
    }).then(data => {
      setUpdatedTime(data.data.updateArticle.updatedAt);
    });
  };

  return (
    <StyledContainer>
      <TopBar>
        <Breadcrumbs maxItems={4} aria-label="breadcrumb">
          {articleWithParents.data?.getArticleWithParents?.map(article => (
            <NextLink
              href="/article/[article]"
              as={`/article/${article.title}-${article.id}`}
              passHref
            >
              <ClickableText>{article.title}</ClickableText>
            </NextLink>
          ))}
        </Breadcrumbs>
        {!lastModificationTime.includes("Invalid") && (
          <NextLink
            href="/modification/article/[article]"
            as={`/modification/article/${
              articleWithParents.data?.getArticleWithParents[
                articleWithParents.data?.getArticleWithParents.length - 1
              ]?.title
            }-${
              articleWithParents.data?.getArticleWithParents[
                articleWithParents.data?.getArticleWithParents.length - 1
              ]?.id
            }`}
          >
            <Tooltip title={"Watch modifications"}>
              <StyledButton color="secondary">
                Last modified {lastModificationTime}
              </StyledButton>
            </Tooltip>
          </NextLink>
        )}
      </TopBar>
      <TitleTypography variant="h3">
        {
          articleWithParents.data?.getArticleWithParents[
            articleWithParents.data?.getArticleWithParents.length - 1
          ]?.title
        }
      </TitleTypography>
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
        valueTemplate={
          articleWithParents.data?.getArticleWithParents[
            articleWithParents.data?.getArticleWithParents.length - 1
          ]?.content
        }
      >
        <Inject
          services={[Count, Image, Link, QuickToolbar, HtmlEditor, Toolbar]}
        />
      </RichTextEditorComponent>
    </StyledContainer>
  );
};

export default ArticleContent;
