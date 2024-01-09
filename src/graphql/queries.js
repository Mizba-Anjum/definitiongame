/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWord = /* GraphQL */ `
  query GetWord($id: ID!) {
    getWord(id: $id) {
      id
      mainWord
      complement1
      complement2
      complement3
      complement4
      complement5
      createdAt
      updatedAt
    }
  }
`;
export const listWords = /* GraphQL */ `
  query ListWords(
    $filter: ModelWordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        mainWord
        complement1
        complement2
        complement3
        complement4
        complement5
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
