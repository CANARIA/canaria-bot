const GitHubApi = require('github');

var github = new GitHubApi({
  version: '3.0.0'
});

github.authenticate({
  type: 'oauth',
  token: process.env.GITHUB_ACCESS_TOKEN,
});

exports.getRef = async (owner, repo, branch) => {
  return new Promise((resolve, reject) => {
    github.gitdata.getReference({
      owner: owner,
      repo: repo,
      ref: `heads/${branch}`,
    }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

exports.list = async (owner, repo) => {
  return new Promise((resolve, reject) => {
    github.pullRequests.getAll({
      owner: owner,
      repo: repo,
      sort: 'updated',
    }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

exports.create = async (owner, repo, ref, sha) => {
  return new Promise((resolve, reject) => {
    github.gitdata.createReference({
      owner: owner,
      repo: repo,
      ref: ref,
      sha: sha,
    }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    })
  });
};


exports.release = async (owner, repo, title) => {
  return new Promise((resolve, reject) => {
    github.pullRequests.create({
      owner: owner,
      repo: repo,
      title: title,
      head: title,
      base: 'master',
    }, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
