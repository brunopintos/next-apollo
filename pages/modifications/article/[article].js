import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import styled from "styled-components";
import withAuth from "../../../lib/jwt";
import { useQuery } from "@apollo/react-hooks";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import PersonIcon from "@material-ui/icons/Person";
import Divider from "@material-ui/core/Divider";

const GET_ARTICLE_MODIFICATIONS = gql`
  query getArticleModifications($id: ID!) {
    getArticleModifications(id: $id) {
      id
      previousContent
      author {
        username
      }
      createdAt
    }
  }
`;

const ArticleModification = props => {
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_ARTICLE_MODIFICATIONS, {
    variables: {
      id: /(.*)\-(\d+)$/.exec(router.query.article)[2]
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  return (
    <div>
      {props.changeTitle(`LKB - ${articleTitle} modifications`)}
      <Typography>
        Lista de Modificaciones del articulo: {articleTitle}
      </Typography>
      <List>
        {data.getArticleModifications.map(modification => (
          <>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div style={{ maxHeight: 200, overflow: "hidden" }}>
                    Previous Content:
                    <div
                      dangerouslySetInnerHTML={{
                        __html: modification.previousContent
                      }}
                    ></div>
                  </div>
                }
                secondary={
                  <>
                    <Typography color="secondary">
                      {`Modification author: ${modification.author.username}`}
                    </Typography>
                    {new Date(modification.createdAt).toString()}
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </div>
  );
};

export default withAuth()(ArticleModification);
