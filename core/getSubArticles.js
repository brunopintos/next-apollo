import gql from "graphql-tag";

const GET_SUB_ARTICLES = gql`
  query getSubArticles($id: ID!) {
    getSubArticles(id: $id) {
      id
      title
      icon
      content
      parent {
        id
      }
    }
  }
`;

export default GET_SUB_ARTICLES;
