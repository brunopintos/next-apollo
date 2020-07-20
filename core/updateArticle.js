import gql from "graphql-tag";

const UPDATE_ARTICLE = gql`
  mutation updateArticle($newContent: String!, $articleId: ID!) {
    updateArticle(input: { newContent: $newContent, articleId: $articleId }) {
      id
      updatedAt
    }
  }
`;

export default UPDATE_ARTICLE;
