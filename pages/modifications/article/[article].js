import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import moment from "moment";

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
      previousContent
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
      <div
        style={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Typography
          style={{
            fontWeight: "bold"
          }}
          variant="h4"
          color="secondary"
        >
          Article Modifications: {articleTitle}
        </Typography>
      </div>
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      maxHeight: 300,
                      overflow: "hidden",
                      paddingBottom: 20
                    }}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: modification.newContent
                      }}
                      style={{ backgroundColor: "lightgreen", minWidth: "49%" }}
                    ></div>
                    <Divider orientation="vertical" flexItem />
                    <div
                      dangerouslySetInnerHTML={{
                        __html: modification.previousContent
                      }}
                      style={{ backgroundColor: "lightcoral", minWidth: "49%" }}
                    ></div>
                  </div>
                }
                secondary={
                  <>
                    <Typography color="secondary">
                      {`Author: ${modification.author.username}`}
                    </Typography>
                    {moment(modification.updatedAt).calendar()}
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
