/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n    query Me {\n        me {\n            email\n            role\n        }\n    }\n": typeof types.MeDocument,
    "\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            refreshToken\n        }\n    }\n": typeof types.RefreshDocument,
    "\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n": typeof types.LoginDocument,
    "\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n": typeof types.LogoutDocument,
    "\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n": typeof types.RegisterDocument,
    "\n    query DepthChartLists($teamSlug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $teamSlug, year: $year) {\n            year\n            updatedAt\n            charts {\n                id\n                title\n                url\n                season\n                week\n                publishedAt\n                detectedAt\n            }\n        }\n    }\n": typeof types.DepthChartListsDocument,
    "\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            slug\n            name\n            abbreviation\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n": typeof types.TeamDocument,
    "\n    query MySubscriptions {\n        mySubscriptions {\n            enabled\n            team {\n                slug\n            }\n        }\n    }\n": typeof types.MySubscriptionsDocument,
    "\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n": typeof types.SubscribeDocument,
    "\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n": typeof types.UnsubscribeDocument,
    "\n    query Teams {\n        teams {\n            slug\n            name\n            abbreviation\n            isActive\n        }\n    }\n": typeof types.TeamsDocument,
    "\n    mutation UnsubscribeWithToken($token: String!) {\n        unsubscribeWithToken(token: $token)\n    }\n": typeof types.UnsubscribeWithTokenDocument,
};
const documents: Documents = {
    "\n    query Me {\n        me {\n            email\n            role\n        }\n    }\n": types.MeDocument,
    "\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            refreshToken\n        }\n    }\n": types.RefreshDocument,
    "\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n": types.LoginDocument,
    "\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n": types.LogoutDocument,
    "\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n": types.RegisterDocument,
    "\n    query DepthChartLists($teamSlug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $teamSlug, year: $year) {\n            year\n            updatedAt\n            charts {\n                id\n                title\n                url\n                season\n                week\n                publishedAt\n                detectedAt\n            }\n        }\n    }\n": types.DepthChartListsDocument,
    "\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            slug\n            name\n            abbreviation\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n": types.TeamDocument,
    "\n    query MySubscriptions {\n        mySubscriptions {\n            enabled\n            team {\n                slug\n            }\n        }\n    }\n": types.MySubscriptionsDocument,
    "\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n": types.SubscribeDocument,
    "\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n": types.UnsubscribeDocument,
    "\n    query Teams {\n        teams {\n            slug\n            name\n            abbreviation\n            isActive\n        }\n    }\n": types.TeamsDocument,
    "\n    mutation UnsubscribeWithToken($token: String!) {\n        unsubscribeWithToken(token: $token)\n    }\n": types.UnsubscribeWithTokenDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Me {\n        me {\n            email\n            role\n        }\n    }\n"): (typeof documents)["\n    query Me {\n        me {\n            email\n            role\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation Refresh($refreshToken: String!) {\n        refresh(refreshToken: $refreshToken) {\n            accessToken\n            refreshToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation Login($email: String!, $password: String!) {\n        login(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n"): (typeof documents)["\n    mutation Logout($refreshToken: String!) {\n        logout(refreshToken: $refreshToken)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n"): (typeof documents)["\n    mutation Register($email: String!, $password: String!) {\n        register(email: $email, password: $password) {\n            accessToken\n            refreshToken\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query DepthChartLists($teamSlug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $teamSlug, year: $year) {\n            year\n            updatedAt\n            charts {\n                id\n                title\n                url\n                season\n                week\n                publishedAt\n                detectedAt\n            }\n        }\n    }\n"): (typeof documents)["\n    query DepthChartLists($teamSlug: String!, $year: Int!) {\n        depthChartLists(teamSlug: $teamSlug, year: $year) {\n            year\n            updatedAt\n            charts {\n                id\n                title\n                url\n                season\n                week\n                publishedAt\n                detectedAt\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            slug\n            name\n            abbreviation\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n"): (typeof documents)["\n    query Team($slug: String!) {\n        team(slug: $slug) {\n            slug\n            name\n            abbreviation\n        }\n        depthChartYears(teamSlug: $slug)\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query MySubscriptions {\n        mySubscriptions {\n            enabled\n            team {\n                slug\n            }\n        }\n    }\n"): (typeof documents)["\n    query MySubscriptions {\n        mySubscriptions {\n            enabled\n            team {\n                slug\n            }\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n"): (typeof documents)["\n    mutation Subscribe($teamSlug: String!) {\n        subscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n"): (typeof documents)["\n    mutation Unsubscribe($teamSlug: String!) {\n        unsubscribe(teamSlug: $teamSlug) {\n            enabled\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query Teams {\n        teams {\n            slug\n            name\n            abbreviation\n            isActive\n        }\n    }\n"): (typeof documents)["\n    query Teams {\n        teams {\n            slug\n            name\n            abbreviation\n            isActive\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UnsubscribeWithToken($token: String!) {\n        unsubscribeWithToken(token: $token)\n    }\n"): (typeof documents)["\n    mutation UnsubscribeWithToken($token: String!) {\n        unsubscribeWithToken(token: $token)\n    }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;