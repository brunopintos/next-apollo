import gql from "graphql-tag";

const MOVE_ARTICLE = gql`
  mutation moveArticle($subArticleId: ID!, $parentId: ID!) {
    moveArticle(input: { subArticleId: $subArticleId, parentId: $parentId }) {
      id
      title
      icon
      content
    }
  }
`;

export default MOVE_ARTICLE;
