import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

// Provider, Consumer - GithbuContext.Provider
// skip Consumer

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [requests, setRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });


  const searchGithubUser = async(user) => {
    setLoading(true)
    const response = await axios.get(`${rootUrl}/users/${user}`).catch(error => {console.log(error)});
    console.log(response);
    if(response){
      toggleError();
      setGithubUser(response.data);
      
    } else {
      toggleError(true, 'there is no user with that username');
    }
    checkRequest();
    setLoading(false);
  }

  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(
            true,
            "Sorry, API requests were exceeced, try again later."
          );
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleError = (show = false, msg = "" ) => {
    setError({ show, msg });
  };

  useEffect(() => {
    checkRequest();
  }, []);

  return (
    <GithubContext.Provider
      value={{ githubUser, repos, followers, requests, error, loading, searchGithubUser }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
