import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import PersonIcon from "@material-ui/icons/Person";

import withAuth from "../../../lib/jwt";

const GET_ARTICLE_MODIFICATIONS = gql`
  query getArticleModifications($id: ID!) {
    getArticleModifications(id: $id) {
      id
      newContent
      author {
        username
      }
      updatedAt
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

  const articleTitle = /(.*)\-(\d+)$/.exec(router.query.article)[1];

  return (
    <div>
      {props.changeTitle(`LKB - ${articleTitle} modifications`)}
      <Typography>
        Lista de Modificaciones del articulo: {articleTitle}
      </Typography>
      <List>
        {data?.getArticleModifications.map(modification => (
          <>
            <ListItem key={modification.id}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <div style={{ maxHeight: 200, overflow: "hidden" }}>
                    New Content:
                    <div
                      dangerouslySetInnerHTML={{
                        __html: modification.newContent
                      }}
                    ></div>
                  </div>
                }
                secondary={
                  <>
                    <Typography color="secondary">
                      {`Modification author: ${modification.author.username}`}
                    </Typography>
                    {new Date(modification.updatedAt).toString()}
                  </>
                }
              />
            </ListItem>
            <Divider
              key={"d" + modification.id}
              variant="inset"
              component="li"
            />
          </>
        ))}
      </List>
    </div>
  );
};

export default withAuth()(ArticleModification);
