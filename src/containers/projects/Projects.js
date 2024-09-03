import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import "./Project.css";
import GithubRepoCard from "../../components/githubRepoCard/GithubRepoCard";
import Button from "../../components/button/Button";
import { openSource } from "../../portfolio";
import { greeting } from "../../portfolio.js";

export default function Projects({ theme }) {
  const [repo, setRepo] = useState([]);

  useEffect(() => {
    getRepoData();
  }, []);

  function getRepoData() {
    const client = new ApolloClient({
      uri: "https://api.github.com/graphql",
      cache: new InMemoryCache(),
      headers: {
        authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`, // Use environment variable
      },
    });

    client
      .query({
        query: gql`
          {
            repositoryOwner(login: "${openSource.githubUserName}") {
              ... on User {
                repositories(first: 10, orderBy: { field: STARGAZERS, direction: DESC }) {
                  edges {
                    node {
                      name
                      description
                      forkCount
                      stargazers {
                        totalCount
                      }
                      url
                      id
                      diskUsage
                      primaryLanguage {
                        name
                        color
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        setRepo(result.data.repositoryOwner.repositories.edges);
        console.log(result);
      })
      .catch((error) => {
        console.error('Error fetching repository data:', error);
      });
  }

  return (
    <div className="main" id="opensource">
      <h1 className="project-title">Open Source Projects</h1>
      <div className="repo-cards-div-main">
        {repo.map((v) => (
          <GithubRepoCard repo={v.node} key={v.node.id} theme={theme} />
        ))}
      </div>
      <Button
        text={"More Projects"}
        className="project-button"
        href={greeting.githubProfile}
        newTab={true}
      />
    </div>
  );
}
