import { YEAR } from '@libs/consts';

export const pinnedRepositoriesQuery = `query pinnedReposities($username: String!) {
  user(login: $username) {
    organizations(first:100) {
      nodes {
        name
        url
        avatarUrl
      }
    }
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          url
          description
          stargazerCount
          forkCount
          languages(first: 3, orderBy: {field: SIZE, direction: DESC}) {
            nodes {
              name
            }
          }
        }
      }
    }
  }
}`;

export const issueQuery = `query repositories($username: String!) {
  user(login: $username) {
    issues(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      edges {
        node {
          repository {
            stargazerCount
            forkCount
            nameWithOwner
          }
          title
          createdAt
        }
      }
    }
  }
}`;

export const userHistoryQuery = `query ContributionsView($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        colors
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
      totalCommitContributions
      totalIssueContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      totalRepositoryContributions
    }
    repositories(
      first: 100
      ownerAffiliations: OWNER
      isFork: false
      orderBy: {direction: DESC, field: STARGAZERS}
      ) {
        totalCount
        nodes {
          name
          stargazerCount
          forkCount
        }
      }
    }
  }`;

export const followersQuery = `query repositories($username: String!) {
  user(login: $username) {
    followers {
      totalCount
    }
  }
}`;

export const forkRepositoryQuery = `query repositories($username: String!, $id: ID) {
  user(login: $username) {
    repositories(
      first: 25
      isFork: true
      privacy: PUBLIC
      orderBy: {field: STARGAZERS, direction: DESC}
      ownerAffiliations: [OWNER]
    ) {
      nodes {
        parent {
          primaryLanguage {
            name
          }
          diskUsage
          name
          stargazerCount
          forkCount
          defaultBranchRef {
            target {
              ... on Commit {
                history(author: {id: $id}, first: 100, since: ${new Date(
                  new Date().getTime() - 5 * YEAR * 1000,
                ).toISOString()}) {
                  nodes {
                    committedDate
                  }
                }
              }
            }
          }
          languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
            totalSize
          }
        }
      }
    }
  }
}`;

export const nonForkRepositoryQuery = `query repositories($username: String!, $id: ID) {
  user(login: $username) {
    repositories(
      first: 25
      isFork: false
      privacy: PUBLIC
      orderBy: {field: STARGAZERS, direction: DESC}
    ) {
      nodes {
        primaryLanguage {
          name
        }
        diskUsage
        name
        stargazerCount
        forkCount
        defaultBranchRef {
          target {
            ... on Commit {
              history(author: {id: $id}, first: 100) {
                nodes {
                  committedDate
                }
              }
            }
          }
        }
        languages(first: 50, orderBy: {field: SIZE, direction: DESC}) {
          totalSize
        }
      }
    }
  }
}`;
