import gql from "graphql-tag";

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

export default GET_ARTICLE_MODIFICATIONS;
