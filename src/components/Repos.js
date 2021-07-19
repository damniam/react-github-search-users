import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { Pie2D, Column2D, Bar2D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) {
      return total;
    }
    if (!total[language]) {
      total[language] = {
        label: language,
        value: 1,
        stars: stargazers_count,
      };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});

  // ---> stars per repos
  // ---> name of repo per forks
  // we need to extract stars, repos and forks

  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { name, stargazers_count, forks } = item;
      total.stars[stargazers_count] = {
        label: name,
        value: stargazers_count,
      };
      total.forks[stargazers_count] = {
        label: name,
        value: forks,
      };

      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  const mostUsed = Object.values(languages).sort((a, b) => b.value - a.value);
  const mostStars = Object.values(languages)
    .sort((a, b) => b.stars - a.stars)
    .map((item) => {
      return {
        ...item,
        value: item.stars,
      };
    });

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie2D data={mostUsed} />
        <Column2D data={stars} />
        <Doughnut2D data={mostStars} />
        <Bar2D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
