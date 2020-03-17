import gql from "graphql-tag";

const GET_FIRST_ARTICLE = gql`
  query getFirstArticle {
    getFirstArticle {
      id
      title
    }
  }
`;

export default GET_FIRST_ARTICLE;
