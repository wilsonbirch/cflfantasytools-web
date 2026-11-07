/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export enum CoachingRole {
  Dc = 'DC',
  Hc = 'HC',
  Oc = 'OC'
}

export type CoachingStaffInput = {
  effectiveFrom: string;
  effectiveTo?: string | null | undefined;
  person: string;
  role: CoachingRole;
  teamSlug: string;
};

/** OK: positions were read. UNSUPPORTED: this club's layout has no parser yet. FAILED: the parser ran and could not read the file. */
export enum DepthChartParseStatus {
  Failed = 'FAILED',
  Ok = 'OK',
  Unsupported = 'UNSUPPORTED'
}

export enum JobStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Succeeded = 'SUCCEEDED'
}

export enum PassDepth {
  Deep = 'DEEP',
  Short = 'SHORT'
}

export enum PassDirection {
  Left = 'LEFT',
  Middle = 'MIDDLE',
  Right = 'RIGHT'
}

export enum PlayerPosition {
  Other = 'OTHER',
  Quarterback = 'QUARTERBACK',
  RunningBack = 'RUNNING_BACK',
  WideReceiver = 'WIDE_RECEIVER'
}

export enum Role {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum ScrapeStatus {
  Failed = 'FAILED',
  Ok = 'OK',
  Rejected = 'REJECTED'
}

/** Every field optional; omitted fields are left unchanged. */
export type TeamSourceInput = {
  config?: unknown;
  enabled?: boolean | null | undefined;
  requiresBrowser?: boolean | null | undefined;
  strategy?: string | null | undefined;
  url?: string | null | undefined;
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { email: string, role: Role } | null };

export type RefreshMutationVariables = Exact<{
  refreshToken: string;
}>;


export type RefreshMutation = { refresh: { accessToken: string, refreshToken: string, accessTokenExpiresAt: string } };

export type AdminScrapersQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminScrapersQuery = { scrapeRuns: Array<{ id: number, status: ScrapeStatus, itemCount: number | null, addedCount: number | null, error: string | null, startedAt: string, finishedAt: string | null, team: { slug: string, abbreviation: string, name: string } }>, teamSources: Array<{ id: number, kind: string, url: string, strategy: string, config: unknown, requiresBrowser: boolean, enabled: boolean, lastOkAt: string | null, lastError: string | null, lastItemCount: number | null, team: { slug: string, name: string } }> };

export type UpdateTeamSourceMutationVariables = Exact<{
  id: number;
  input: TeamSourceInput;
}>;


export type UpdateTeamSourceMutation = { updateTeamSource: { id: number } };

export type AdminJobsQueryVariables = Exact<{
  status?: JobStatus | null | undefined;
}>;


export type AdminJobsQuery = { jobs: Array<{ id: number, kind: string, status: JobStatus, attempts: number, error: string | null, runAt: string, startedAt: string | null, finishedAt: string | null }>, jobHealth: Array<{ kind: string }> };

export type EnqueueJobMutationVariables = Exact<{
  kind: string;
}>;


export type EnqueueJobMutation = { enqueueJob: { id: number } };

export type AdminStaffQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminStaffQuery = { teams: Array<{ slug: string, name: string, abbreviation: string, coachingStaff: Array<{ id: number, role: CoachingRole, person: string, effectiveFrom: string, effectiveTo: string | null }> }> };

export type UpsertCoachingStaffMutationVariables = Exact<{
  input: CoachingStaffInput;
}>;


export type UpsertCoachingStaffMutation = { upsertCoachingStaff: { id: number } };

export type DeleteCoachingStaffMutationVariables = Exact<{
  id: number;
}>;


export type DeleteCoachingStaffMutation = { deleteCoachingStaff: boolean };

export type FantasyPlayersQueryVariables = Exact<{
  year: number;
  gameweekId?: number | null | undefined;
  position?: PlayerPosition | null | undefined;
  teamSlug?: string | null | undefined;
}>;


export type FantasyPlayersQuery = { seasons: Array<number>, teams: Array<{ slug: string, name: string, abbreviation: string }>, gameweeks: Array<{ id: number, week: number, name: string, status: string, startDate: string | null }>, fantasyPlayers: Array<{ id: number, name: string, position: PlayerPosition, salary: number | null, weekSalaryChange: number | null, gameZoneProjection: number | null, seasonPoints: number | null, avgPoints: number | null, lastGameweekPoints: number | null, isLocked: boolean, injuredText: string | null, status: string | null, value: number | null, team: { slug: string, abbreviation: string } | null, projection: { points: number, epa: number, opponent: { abbreviation: string } | null } | null }> };

export type FantasyPlayerQueryVariables = Exact<{
  id: number;
  gameweekId?: number | null | undefined;
}>;


export type FantasyPlayerQuery = { fantasyPlayer: { id: number, name: string, position: PlayerPosition, salary: number | null, weekSalaryChange: number | null, gameZoneProjection: number | null, seasonPoints: number | null, avgPoints: number | null, lastGameweekPoints: number | null, isLocked: boolean, injuredText: string | null, status: string | null, value: number | null, team: { slug: string, name: string, abbreviation: string } | null, pointsHistory: Array<{ points: number, gameweek: { id: number, week: number, year: number } }>, salaryHistory: Array<{ capturedAt: string, salary: number, weekSalaryChange: number | null, gameZoneProjection: number | null }>, projection: { points: number, epa: number, alignment: string | null, games: number, fittedAt: string, passAttempts: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, gameweek: { week: number, year: number }, opponent: { slug: string, abbreviation: string } | null } | null } | null };

export type GameQueryVariables = Exact<{
  id: number;
}>;


export type GameQuery = { game: { id: number, year: number, date: string | null, homeScore: number | null, awayScore: number | null, homeTeam: { slug: string, abbreviation: string, name: string } | null, awayTeam: { slug: string, abbreviation: string, name: string } | null, boxScore: Array<{ points: number, plays: number, totalYards: number, passAttempts: number, completions: number, passingYards: number, rushAttempts: number, rushingYards: number, firstDowns: number, turnovers: number, epa: number, team: { slug: string, abbreviation: string } }>, playerStats: Array<{ player: string, alignment: string | null, passAttempts: number, completions: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, epa: number, team: { slug: string, abbreviation: string }, targetsByZone: Array<{ depth: PassDepth, direction: PassDirection, targets: number, receptions: number, yards: number, epa: number }> }> } | null };

export type GamesQueryVariables = Exact<{
  year: number;
  teamSlug?: string | null | undefined;
}>;


export type GamesQuery = { seasons: Array<number>, teams: Array<{ slug: string, name: string, abbreviation: string }>, games: Array<{ id: number, date: string | null, homeScore: number | null, awayScore: number | null, homeTeam: { slug: string, abbreviation: string } | null, awayTeam: { slug: string, abbreviation: string } | null }> };

export type LoginMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type LoginMutation = { login: { accessToken: string, refreshToken: string, accessTokenExpiresAt: string } };

export type LogoutMutationVariables = Exact<{
  refreshToken: string;
}>;


export type LogoutMutation = { logout: boolean };

export type RegisterMutationVariables = Exact<{
  email: string;
  password: string;
}>;


export type RegisterMutation = { register: { accessToken: string, refreshToken: string, accessTokenExpiresAt: string } };

export type SeasonStatsQueryVariables = Exact<{
  year: number;
  teamSlug?: string | null | undefined;
}>;


export type SeasonStatsQuery = { seasons: Array<number>, teams: Array<{ slug: string, name: string, abbreviation: string }>, playerSeasonStats: Array<{ player: string, primaryAlignment: string | null, games: number, passAttempts: number, completions: number, passingYards: number, passingTouchdowns: number, interceptions: number, rushAttempts: number, rushingYards: number, rushingTouchdowns: number, targets: number, receptions: number, receivingYards: number, receivingTouchdowns: number, epa: number, team: { slug: string, abbreviation: string } }> };

export type JobHealthQueryVariables = Exact<{ [key: string]: never; }>;


export type JobHealthQuery = { jobHealth: Array<{ kind: string, ageMinutes: number | null, expectedEveryMinutes: number, isStale: boolean, lastSuccessAt: string | null }> };

export type DepthChartListsQueryVariables = Exact<{
  teamSlug: string;
  year: number;
}>;


export type DepthChartListsQuery = { team: { coachingStaff: Array<{ id: number, role: CoachingRole, person: string, effectiveFrom: string, effectiveTo: string | null }> } | null, depthChartLists: Array<{ year: number, updatedAt: string, charts: Array<{ id: number, title: string, url: string, season: string, week: number, publishedAt: string, detectedAt: string, parseStatus: DepthChartParseStatus | null, files: Array<{ id: number, sha256: string, size: number, fetchedAt: string, url: string }> }> }> };

export type TeamAlignmentQueryVariables = Exact<{
  teamSlug: string;
  year: number;
  week?: number | null | undefined;
}>;


export type TeamAlignmentQuery = { teamAlignment: { week: number, weeks: Array<number>, chart: { title: string, url: string, publishedAt: string }, positions: Array<{ position: string, depth: number, player: string, jersey: number | null }> } | null };

export type TeamQueryVariables = Exact<{
  slug: string;
}>;


export type TeamQuery = { depthChartYears: Array<number>, team: { slug: string, name: string, abbreviation: string } | null };

export type MySubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MySubscriptionsQuery = { mySubscriptions: Array<{ enabled: boolean, team: { slug: string } }> };

export type SubscribeMutationVariables = Exact<{
  teamSlug: string;
}>;


export type SubscribeMutation = { subscribe: { enabled: boolean } };

export type UnsubscribeMutationVariables = Exact<{
  teamSlug: string;
}>;


export type UnsubscribeMutation = { unsubscribe: { enabled: boolean } };

export type TeamsQueryVariables = Exact<{ [key: string]: never; }>;


export type TeamsQuery = { teams: Array<{ slug: string, name: string, abbreviation: string, isActive: boolean }> };

export type UnsubscribeWithTokenMutationVariables = Exact<{
  token: string;
}>;


export type UnsubscribeWithTokenMutation = { unsubscribeWithToken: boolean };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessTokenExpiresAt"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const AdminScrapersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminScrapers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scrapeRuns"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"addedCount"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"finishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"teamSources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"strategy"}},{"kind":"Field","name":{"kind":"Name","value":"config"}},{"kind":"Field","name":{"kind":"Name","value":"requiresBrowser"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"lastOkAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastError"}},{"kind":"Field","name":{"kind":"Name","value":"lastItemCount"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AdminScrapersQuery, AdminScrapersQueryVariables>;
export const UpdateTeamSourceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTeamSource"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TeamSourceInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTeamSource"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateTeamSourceMutation, UpdateTeamSourceMutationVariables>;
export const AdminJobsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminJobs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JobStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobs"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"attempts"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"runAt"}},{"kind":"Field","name":{"kind":"Name","value":"startedAt"}},{"kind":"Field","name":{"kind":"Name","value":"finishedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"jobHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}}]}}]}}]} as unknown as DocumentNode<AdminJobsQuery, AdminJobsQueryVariables>;
export const EnqueueJobDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnqueueJob"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"kind"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enqueueJob"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"kind"},"value":{"kind":"Variable","name":{"kind":"Name","value":"kind"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EnqueueJobMutation, EnqueueJobMutationVariables>;
export const AdminStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"coachingStaff"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"person"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveFrom"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveTo"}}]}}]}}]}}]} as unknown as DocumentNode<AdminStaffQuery, AdminStaffQueryVariables>;
export const UpsertCoachingStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpsertCoachingStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CoachingStaffInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertCoachingStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpsertCoachingStaffMutation, UpsertCoachingStaffMutationVariables>;
export const DeleteCoachingStaffDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCoachingStaff"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCoachingStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCoachingStaffMutation, DeleteCoachingStaffMutationVariables>;
export const FantasyPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FantasyPlayers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameweekId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"position"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PlayerPosition"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"gameweeks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"fantasyPlayers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"gameweekId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameweekId"}}},{"kind":"Argument","name":{"kind":"Name","value":"position"},"value":{"kind":"Variable","name":{"kind":"Name","value":"position"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"400"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"weekSalaryChange"}},{"kind":"Field","name":{"kind":"Name","value":"gameZoneProjection"}},{"kind":"Field","name":{"kind":"Name","value":"seasonPoints"}},{"kind":"Field","name":{"kind":"Name","value":"avgPoints"}},{"kind":"Field","name":{"kind":"Name","value":"lastGameweekPoints"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"injuredText"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"projection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}},{"kind":"Field","name":{"kind":"Name","value":"opponent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FantasyPlayersQuery, FantasyPlayersQueryVariables>;
export const FantasyPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FantasyPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"gameweekId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fantasyPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"gameweekId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"gameweekId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"weekSalaryChange"}},{"kind":"Field","name":{"kind":"Name","value":"gameZoneProjection"}},{"kind":"Field","name":{"kind":"Name","value":"seasonPoints"}},{"kind":"Field","name":{"kind":"Name","value":"avgPoints"}},{"kind":"Field","name":{"kind":"Name","value":"lastGameweekPoints"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}},{"kind":"Field","name":{"kind":"Name","value":"injuredText"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"pointsHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"gameweek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"salaryHistory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"capturedAt"}},{"kind":"Field","name":{"kind":"Name","value":"salary"}},{"kind":"Field","name":{"kind":"Name","value":"weekSalaryChange"}},{"kind":"Field","name":{"kind":"Name","value":"gameZoneProjection"}}]}},{"kind":"Field","name":{"kind":"Name","value":"projection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"games"}},{"kind":"Field","name":{"kind":"Name","value":"fittedAt"}},{"kind":"Field","name":{"kind":"Name","value":"gameweek"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"opponent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}}]}}]}}]}}]} as unknown as DocumentNode<FantasyPlayerQuery, FantasyPlayerQueryVariables>;
export const GameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Game"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"game"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"homeScore"}},{"kind":"Field","name":{"kind":"Name","value":"awayScore"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boxScore"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"points"}},{"kind":"Field","name":{"kind":"Name","value":"plays"}},{"kind":"Field","name":{"kind":"Name","value":"totalYards"}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"firstDowns"}},{"kind":"Field","name":{"kind":"Name","value":"turnovers"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}},{"kind":"Field","name":{"kind":"Name","value":"playerStats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"alignment"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}},{"kind":"Field","name":{"kind":"Name","value":"targetsByZone"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"direction"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"yards"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GameQuery, GameQueryVariables>;
export const GamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Games"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"games"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"100"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"homeScore"}},{"kind":"Field","name":{"kind":"Name","value":"awayScore"}},{"kind":"Field","name":{"kind":"Name","value":"homeTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"awayTeam"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}}]}}]}}]} as unknown as DocumentNode<GamesQuery, GamesQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessTokenExpiresAt"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refreshToken"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refreshToken"}}}]}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"refreshToken"}},{"kind":"Field","name":{"kind":"Name","value":"accessTokenExpiresAt"}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const SeasonStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SeasonStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"seasons"}},{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"playerSeasonStats"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"200"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"primaryAlignment"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"games"}},{"kind":"Field","name":{"kind":"Name","value":"passAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"completions"}},{"kind":"Field","name":{"kind":"Name","value":"passingYards"}},{"kind":"Field","name":{"kind":"Name","value":"passingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"interceptions"}},{"kind":"Field","name":{"kind":"Name","value":"rushAttempts"}},{"kind":"Field","name":{"kind":"Name","value":"rushingYards"}},{"kind":"Field","name":{"kind":"Name","value":"rushingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"targets"}},{"kind":"Field","name":{"kind":"Name","value":"receptions"}},{"kind":"Field","name":{"kind":"Name","value":"receivingYards"}},{"kind":"Field","name":{"kind":"Name","value":"receivingTouchdowns"}},{"kind":"Field","name":{"kind":"Name","value":"epa"}}]}}]}}]} as unknown as DocumentNode<SeasonStatsQuery, SeasonStatsQueryVariables>;
export const JobHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"JobHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"jobHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"ageMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"expectedEveryMinutes"}},{"kind":"Field","name":{"kind":"Name","value":"isStale"}},{"kind":"Field","name":{"kind":"Name","value":"lastSuccessAt"}}]}}]}}]} as unknown as DocumentNode<JobHealthQuery, JobHealthQueryVariables>;
export const DepthChartListsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DepthChartLists"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"coachingStaff"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"person"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveFrom"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveTo"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"depthChartLists"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"charts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"season"}},{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}},{"kind":"Field","name":{"kind":"Name","value":"detectedAt"}},{"kind":"Field","name":{"kind":"Name","value":"parseStatus"}},{"kind":"Field","name":{"kind":"Name","value":"files"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sha256"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"fetchedAt"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DepthChartListsQuery, DepthChartListsQueryVariables>;
export const TeamAlignmentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TeamAlignment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"week"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teamAlignment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"week"},"value":{"kind":"Variable","name":{"kind":"Name","value":"week"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"week"}},{"kind":"Field","name":{"kind":"Name","value":"weeks"}},{"kind":"Field","name":{"kind":"Name","value":"chart"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"publishedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"positions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"depth"}},{"kind":"Field","name":{"kind":"Name","value":"player"}},{"kind":"Field","name":{"kind":"Name","value":"jersey"}}]}}]}}]}}]} as unknown as DocumentNode<TeamAlignmentQuery, TeamAlignmentQueryVariables>;
export const TeamDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Team"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"team"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"depthChartYears"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}]}]}}]} as unknown as DocumentNode<TeamQuery, TeamQueryVariables>;
export const MySubscriptionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MySubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mySubscriptions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"team"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<MySubscriptionsQuery, MySubscriptionsQueryVariables>;
export const SubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Subscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<SubscribeMutation, SubscribeMutationVariables>;
export const UnsubscribeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Unsubscribe"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribe"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"teamSlug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"teamSlug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}}]}}]}}]} as unknown as DocumentNode<UnsubscribeMutation, UnsubscribeMutationVariables>;
export const TeamsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"teams"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"abbreviation"}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}}]}}]}}]} as unknown as DocumentNode<TeamsQuery, TeamsQueryVariables>;
export const UnsubscribeWithTokenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsubscribeWithToken"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribeWithToken"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<UnsubscribeWithTokenMutation, UnsubscribeWithTokenMutationVariables>;