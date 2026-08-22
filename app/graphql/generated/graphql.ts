/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: unknown; output: unknown; }
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  role: Role;
  uuid: Scalars['String']['output'];
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  accessToken: Scalars['String']['output'];
  account: Account;
  /** One-time use. Each refresh returns a new token and revokes this one. */
  refreshToken: Scalars['String']['output'];
};

/** One posted depth chart; `url` is the club's own PDF. */
export type DepthChart = {
  __typename?: 'DepthChart';
  /** When the scraper first saw the chart. */
  detectedAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  publishedAt: Scalars['DateTime']['output'];
  season: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
  week: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

/** A team's depth charts for one season, newest chart first. */
export type DepthChartList = {
  __typename?: 'DepthChartList';
  charts: Array<DepthChart>;
  id: Scalars['Int']['output'];
  team: Team;
  updatedAt: Scalars['DateTime']['output'];
  uuid: Scalars['String']['output'];
  year: Scalars['Int']['output'];
};

export type Drive = {
  __typename?: 'Drive';
  id: Scalars['Int']['output'];
  isScoring: Scalars['Boolean']['output'];
  number: Scalars['Int']['output'];
  /** Signed for the possessing team: negative means the opponent scored. */
  points?: Maybe<Scalars['Int']['output']>;
  startQuarter?: Maybe<Scalars['Int']['output']>;
  team: Team;
};

export enum EmailStatus {
  Bounced = 'BOUNCED',
  Complained = 'COMPLAINED',
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Queued = 'QUEUED',
  Sent = 'SENT'
}

/** One fixture. Scores and stats are derived from plays at read time. */
export type Game = {
  __typename?: 'Game';
  awayScore?: Maybe<Scalars['Int']['output']>;
  awayTeam?: Maybe<Team>;
  boxScore: Array<TeamBoxScore>;
  date?: Maybe<Scalars['DateTime']['output']>;
  drives: Array<Drive>;
  homeScore?: Maybe<Scalars['Int']['output']>;
  homeTeam?: Maybe<Team>;
  id: Scalars['Int']['output'];
  playerStats: Array<PlayerGameStats>;
  /** Chronological, including no-plays. */
  plays: Array<Play>;
  ruleEra?: Maybe<RuleEra>;
  year: Scalars['Int']['output'];
};

export type Job = {
  __typename?: 'Job';
  attempts: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  error?: Maybe<Scalars['String']['output']>;
  finishedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  kind: Scalars['String']['output'];
  payload: Scalars['JSON']['output'];
  runAt: Scalars['DateTime']['output'];
  startedAt?: Maybe<Scalars['DateTime']['output']>;
  status: JobStatus;
};

/** Freshness of one scheduled background job. */
export type JobHealth = {
  __typename?: 'JobHealth';
  ageMinutes?: Maybe<Scalars['Int']['output']>;
  expectedEveryMinutes: Scalars['Int']['output'];
  isStale: Scalars['Boolean']['output'];
  kind: Scalars['String']['output'];
  lastSuccessAt?: Maybe<Scalars['DateTime']['output']>;
};

export enum JobStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Succeeded = 'SUCCEEDED'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Admin only. */
  enqueueJob: Job;
  /** Wrong email and wrong password fail identically. */
  login: AuthPayload;
  /** Revokes the session the refresh token belongs to. Idempotent. */
  logout: Scalars['Boolean']['output'];
  /** Rotates the token; reusing a rotated token revokes the whole session. */
  refresh: AuthPayload;
  register: AuthPayload;
  /** Signed in only. */
  subscribe: NotificationSubscription;
  /** Signed in only. */
  unsubscribe: NotificationSubscription;
  /** Signed link from a notification email; needs no session. */
  unsubscribeWithToken: Scalars['Boolean']['output'];
  /** Admin only. */
  updateTeamSource: TeamSource;
};


export type MutationEnqueueJobArgs = {
  kind: Scalars['String']['input'];
  payload?: InputMaybe<Scalars['JSON']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationLogoutArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRefreshArgs = {
  refreshToken: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSubscribeArgs = {
  teamSlug: Scalars['String']['input'];
};


export type MutationUnsubscribeArgs = {
  teamSlug: Scalars['String']['input'];
};


export type MutationUnsubscribeWithTokenArgs = {
  token: Scalars['String']['input'];
};


export type MutationUpdateTeamSourceArgs = {
  id: Scalars['Int']['input'];
  input: TeamSourceInput;
};

export type NotificationSubscription = {
  __typename?: 'NotificationSubscription';
  createdAt: Scalars['DateTime']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  team: Team;
  updatedAt: Scalars['DateTime']['output'];
};

export enum PassDepth {
  Deep = 'DEEP',
  Short = 'SHORT'
}

export enum PassDirection {
  Left = 'LEFT',
  Middle = 'MIDDLE',
  Right = 'RIGHT'
}

export type Play = {
  __typename?: 'Play';
  airYards?: Maybe<Scalars['Int']['output']>;
  clock: Scalars['String']['output'];
  description: Scalars['String']['output'];
  distance?: Maybe<Scalars['String']['output']>;
  down?: Maybe<Scalars['Int']['output']>;
  driveNumber: Scalars['Int']['output'];
  epa?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  /** Whether a pass was caught; null on non-pass plays. */
  isComplete?: Maybe<Scalars['Boolean']['output']>;
  isFirstDown: Scalars['Boolean']['output'];
  /** A penalty wiped this snap; excluded from all stats. */
  isNoPlay: Scalars['Boolean']['output'];
  isScoring: Scalars['Boolean']['output'];
  isTurnover: Scalars['Boolean']['output'];
  number: Scalars['Int']['output'];
  passer?: Maybe<Scalars['String']['output']>;
  phase: Scalars['String']['output'];
  /** Points on this play, signed for its team; -6 is a return touchdown. */
  points?: Maybe<Scalars['Int']['output']>;
  /** 1-4; null in overtime or when the feed gives no quarter. */
  quarter?: Maybe<Scalars['Int']['output']>;
  receiver?: Maybe<Scalars['String']['output']>;
  rusher?: Maybe<Scalars['String']['output']>;
  subtype?: Maybe<Scalars['String']['output']>;
  targetDepth?: Maybe<PassDepth>;
  targetDirection?: Maybe<PassDirection>;
  team: Team;
  type: Scalars['String']['output'];
  yardLine?: Maybe<Scalars['Int']['output']>;
  yardsAfterCatch?: Maybe<Scalars['Int']['output']>;
  yardsGained?: Maybe<Scalars['Int']['output']>;
};

/** Per-player production in one game, from plays (no-plays excluded). */
export type PlayerGameStats = {
  __typename?: 'PlayerGameStats';
  completions: Scalars['Int']['output'];
  epa: Scalars['Float']['output'];
  gameId: Scalars['Int']['output'];
  interceptions: Scalars['Int']['output'];
  passAttempts: Scalars['Int']['output'];
  passingTouchdowns: Scalars['Int']['output'];
  passingYards: Scalars['Int']['output'];
  /** Name as it appears in the play text, e.g. "#12 A.Smith". */
  player: Scalars['String']['output'];
  receivingTouchdowns: Scalars['Int']['output'];
  receivingYards: Scalars['Int']['output'];
  receptions: Scalars['Int']['output'];
  rushAttempts: Scalars['Int']['output'];
  rushingTouchdowns: Scalars['Int']['output'];
  rushingYards: Scalars['Int']['output'];
  targets: Scalars['Int']['output'];
  targetsByZone: Array<ZoneTargets>;
  team: Team;
};

/** Per-player production over a season, from plays (no-plays excluded). */
export type PlayerSeasonStats = {
  __typename?: 'PlayerSeasonStats';
  completions: Scalars['Int']['output'];
  epa: Scalars['Float']['output'];
  games: Scalars['Int']['output'];
  interceptions: Scalars['Int']['output'];
  passAttempts: Scalars['Int']['output'];
  passingTouchdowns: Scalars['Int']['output'];
  passingYards: Scalars['Int']['output'];
  /** Name as it appears in the play text, e.g. "#12 A.Smith". */
  player: Scalars['String']['output'];
  receivingTouchdowns: Scalars['Int']['output'];
  receivingYards: Scalars['Int']['output'];
  receptions: Scalars['Int']['output'];
  rushAttempts: Scalars['Int']['output'];
  rushingTouchdowns: Scalars['Int']['output'];
  rushingYards: Scalars['Int']['output'];
  targets: Scalars['Int']['output'];
  targetsByZone: Array<ZoneTargets>;
  team: Team;
  year: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  depthChartLists: Array<DepthChartList>;
  depthChartYears: Array<Scalars['Int']['output']>;
  game?: Maybe<Game>;
  /** Newest first. Only games with parsed plays. */
  games: Array<Game>;
  isUp: Scalars['Boolean']['output'];
  /** Whether each scheduled job has run recently enough. */
  jobHealth: Array<JobHealth>;
  /** Admin only. Newest first. */
  jobs: Array<Job>;
  /** Null when signed out. */
  me?: Maybe<Account>;
  /** Signed in only. */
  mySubscriptions: Array<NotificationSubscription>;
  /** Sorted by targets + pass attempts + rush attempts, descending. */
  playerSeasonStats: Array<PlayerSeasonStats>;
  /** Admin only. Newest first. */
  scrapeRuns: Array<ScrapeRun>;
  team?: Maybe<Team>;
  /** Admin only. */
  teamSources: Array<TeamSource>;
  teams: Array<Team>;
};


export type QueryDepthChartListsArgs = {
  teamSlug: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDepthChartYearsArgs = {
  teamSlug: Scalars['String']['input'];
};


export type QueryGameArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGamesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  teamSlug?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryJobsArgs = {
  kind?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<JobStatus>;
};


export type QueryPlayerSeasonStatsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  teamSlug?: InputMaybe<Scalars['String']['input']>;
  year: Scalars['Int']['input'];
};


export type QueryScrapeRunsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  teamSlug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTeamArgs = {
  slug: Scalars['String']['input'];
};

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum RuleEra {
  E2026 = 'E2026',
  E2027 = 'E2027',
  Pre_2026 = 'PRE_2026'
}

export type ScrapeRun = {
  __typename?: 'ScrapeRun';
  addedCount?: Maybe<Scalars['Int']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  finishedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['Int']['output'];
  itemCount?: Maybe<Scalars['Int']['output']>;
  startedAt: Scalars['DateTime']['output'];
  status: ScrapeStatus;
  team: Team;
};

export enum ScrapeStatus {
  Failed = 'FAILED',
  Ok = 'OK',
  Rejected = 'REJECTED'
}

export type Team = {
  __typename?: 'Team';
  abbreviation: Scalars['String']['output'];
  city?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nameFr?: Maybe<Scalars['String']['output']>;
  shortName?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

/** One team's totals in a game, from plays (no-plays excluded). */
export type TeamBoxScore = {
  __typename?: 'TeamBoxScore';
  completions: Scalars['Int']['output'];
  epa: Scalars['Float']['output'];
  firstDowns: Scalars['Int']['output'];
  passAttempts: Scalars['Int']['output'];
  passingYards: Scalars['Int']['output'];
  plays: Scalars['Int']['output'];
  points: Scalars['Int']['output'];
  rushAttempts: Scalars['Int']['output'];
  rushingYards: Scalars['Int']['output'];
  team: Team;
  totalYards: Scalars['Int']['output'];
  turnovers: Scalars['Int']['output'];
};

export type TeamSource = {
  __typename?: 'TeamSource';
  config: Scalars['JSON']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  kind: Scalars['String']['output'];
  lastError?: Maybe<Scalars['String']['output']>;
  lastItemCount?: Maybe<Scalars['Int']['output']>;
  lastOkAt?: Maybe<Scalars['DateTime']['output']>;
  requiresBrowser: Scalars['Boolean']['output'];
  strategy: Scalars['String']['output'];
  team: Team;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
};

/** Every field optional; omitted fields are left unchanged. */
export type TeamSourceInput = {
  config?: InputMaybe<Scalars['JSON']['input']>;
  enabled?: InputMaybe<Scalars['Boolean']['input']>;
  requiresBrowser?: InputMaybe<Scalars['Boolean']['input']>;
  strategy?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

/** Targets to one (depth, direction) zone. */
export type ZoneTargets = {
  __typename?: 'ZoneTargets';
  depth: PassDepth;
  direction: PassDirection;
  epa: Scalars['Float']['output'];
  receptions: Scalars['Int']['output'];
  targets: Scalars['Int']['output'];
  yards: Scalars['Int']['output'];
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Account', email: string, role: Role } | null };

export type RefreshMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string } };

export type AdminScrapersQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminScrapersQuery = { __typename?: 'Query', scrapeRuns: Array<{ __typename?: 'ScrapeRun', id: number, status: ScrapeStatus, itemCount?: number | null, addedCount?: number | null, error?: string | null, startedAt: string, finishedAt?: string | null, team: { __typename?: 'Team', slug: string, abbreviation: string, name: string } }>, teamSources: Array<{ __typename?: 'TeamSource', id: number, kind: string, url: string, strategy: string, config: unknown, requiresBrowser: boolean, enabled: boolean, lastOkAt?: string | null, lastError?: string | null, lastItemCount?: number | null, team: { __typename?: 'Team', slug: string, name: string } }> };

export type UpdateTeamSourceMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: TeamSourceInput;
}>;


export type UpdateTeamSourceMutation = { __typename?: 'Mutation', updateTeamSource: { __typename?: 'TeamSource', id: number } };

export type AdminJobsQueryVariables = Exact<{
  status?: InputMaybe<JobStatus>;
}>;


export type AdminJobsQuery = { __typename?: 'Query', jobs: Array<{ __typename?: 'Job', id: number, kind: string, status: JobStatus, attempts: number, error?: string | null, runAt: string, startedAt?: string | null, finishedAt?: string | null }>, jobHealth: Array<{ __typename?: 'JobHealth', kind: string }> };

export type EnqueueJobMutationVariables = Exact<{
  kind: Scalars['String']['input'];
}>;


export type EnqueueJobMutation = { __typename?: 'Mutation', enqueueJob: { __typename?: 'Job', id: number } };

export type GameQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GameQuery = { __typename?: 'Query', game?: { __typename?: 'Game', id: number, year: number, date?: string | null, homeScore?: number | null, awayScore?: number | null, homeTeam?: { __typename?: 'Team', slug: string, abbreviation: string, name: string } | null, awayTeam?: { __typename?: 'Team', slug: string, abbreviation: string, name: string } | null, boxScore: Array<{ __typename?: 'TeamBoxScore', points: number, plays: number, totalYards: number, passAttempts: number, completions: number, passingYards: number, rushAttempts: number, rushingYards: number, firstDowns: number, turnovers: number, epa: number, team: { __typename?: 'Team', slug: string, abbreviation: string } }>, playerStats: Array<{ __typename?: 'PlayerGameStats', player: string, passAttempts: number, completions: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, epa: number, team: { __typename?: 'Team', slug: string, abbreviation: string }, targetsByZone: Array<{ __typename?: 'ZoneTargets', depth: PassDepth, direction: PassDirection, targets: number, receptions: number, yards: number, epa: number }> }> } | null };

export type GamesQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  teamSlug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GamesQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', slug: string, name: string, abbreviation: string }>, games: Array<{ __typename?: 'Game', id: number, date?: string | null, homeScore?: number | null, awayScore?: number | null, homeTeam?: { __typename?: 'Team', slug: string, abbreviation: string } | null, awayTeam?: { __typename?: 'Team', slug: string, abbreviation: string } | null }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string } };

export type LogoutMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', accessToken: string, refreshToken: string } };

export type SeasonStatsQueryVariables = Exact<{
  year: Scalars['Int']['input'];
  teamSlug?: InputMaybe<Scalars['String']['input']>;
}>;


export type SeasonStatsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', slug: string, name: string, abbreviation: string }>, playerSeasonStats: Array<{ __typename?: 'PlayerSeasonStats', player: string, games: number, passAttempts: number, completions: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, epa: number, team: { __typename?: 'Team', slug: string, abbreviation: string } }> };

export type DepthChartListsQueryVariables = Exact<{
  teamSlug: Scalars['String']['input'];
  year: Scalars['Int']['input'];
}>;


export type DepthChartListsQuery = { __typename?: 'Query', depthChartLists: Array<{ __typename?: 'DepthChartList', year: number, updatedAt: string, charts: Array<{ __typename?: 'DepthChart', id: number, title: string, url: string, season: string, week: number, publishedAt: string, detectedAt: string }> }> };

export type TeamQueryVariables = Exact<{
  slug: Scalars['String']['input'];
}>;


export type TeamQuery = { __typename?: 'Query', depthChartYears: Array<number>, team?: { __typename?: 'Team', slug: string, name: string, abbreviation: string } | null };

export type MySubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptionsQuery = { __typename?: 'Query', mySubscriptions: Array<{ __typename?: 'NotificationSubscription', enabled: boolean, team: { __typename?: 'Team', slug: string } }> };

export type SubscribeMutationVariables = Exact<{
  teamSlug: Scalars['String']['input'];
}>;


export type SubscribeMutation = { __typename?: 'Mutation', subscribe: { __typename?: 'NotificationSubscription', enabled: boolean } };

export type UnsubscribeMutationVariables = Exact<{
  teamSlug: Scalars['String']['input'];
}>;


export type UnsubscribeMutation = { __typename?: 'Mutation', unsubscribe: { __typename?: 'NotificationSubscription', enabled: boolean } };

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = { __typename?: 'Query', teams: Array<{ __typename?: 'Team', slug: string, name: string, abbreviation: string, isActive: boolean }> };

export type UnsubscribeWithTokenMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type UnsubscribeWithTokenMutation = { __typename?: 'Mutation', unsubscribeWithToken: boolean };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const AdminScrapersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminScrapers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scrapeRuns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"addedCount"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"finishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teamSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"strategy"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"requiresBrowser"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"lastOkAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastError"}},{"kind":"Field","name":{"kind":"Name","value":"lastItemCount"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AdminScrapersQuery, AdminScrapersQueryVariables>;
export const UpdateTeamSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamSourceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeamSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamSourceMutation, UpdateTeamSourceMutationVariables>;
export const AdminJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attempts"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"runAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"finishedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"jobHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}}]}}]}}]} as unknown as DocumentNode<AdminJobsQuery, AdminJobsQueryVariables>;
export const EnqueueJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnqueueJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enqueueJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EnqueueJobMutation, EnqueueJobMutationVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"homeScore"}},{"kind":"Field","name":{"kind":"Name","value":"awayScore"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boxScore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"plays"}},{"kind":"Field","name":{"kind":"Name","value":"totalYards"}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"firstDowns"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"playerStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}},{"kind":"Field","name":{"kind":"Name","value":"targetsByZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"yards"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"homeScore"}},{"kind":"Field","name":{"kind":"Name","value":"awayScore"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const SeasonStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeasonStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"playerSeasonStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"200"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"games"}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}}]}}]} as unknown as DocumentNode<SeasonStatsQuery, SeasonStatsQueryVariables>;
export const DepthChartListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DepthChartLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"depthChartLists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"charts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}}]}}]}}]}}]} as unknown as DocumentNode<DepthChartListsQuery, DepthChartListsQueryVariables>;
export const TeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Team"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"depthChartYears"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<TeamQuery, TeamQueryVariables>;
export const MySubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MySubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<MySubscriptionsQuery, MySubscriptionsQueryVariables>;
export const SubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Subscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<SubscribeMutation, SubscribeMutationVariables>;
export const UnsubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unsubscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<UnsubscribeMutation, UnsubscribeMutationVariables>;
export const TeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;
export const UnsubscribeWithTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsubscribeWithToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribeWithToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<UnsubscribeWithTokenMutation, UnsubscribeWithTokenMutationVariables>;