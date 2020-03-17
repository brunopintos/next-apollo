import gql from "graphql-tag";

const GET_ARTICLES = gql`
  query getArticles {
    getArticles {
      id
      title
      content
    }
  }
`;

export default GET_ARTICLES;
