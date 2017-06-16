const Botkit = require('botkit');
const PR = require('./pr');

process.on('unhandledRejection', console.dir);

var config = {
  slack: {
    token: process.env.SLACK_TOKEN,
    icon_emoji: ':github:',
    icon_url: 'https://octodex.github.com/images/original.png',
    username: 'deploy BOT',
  }
};


const controller = Botkit.slackbot({
  debug: false
});

controller.spawn({
  token: config.slack.token
}).startRTM(err => {
  if (err) {
    throw new Error(err);
  }
});

controller.hears(['hi', 'hello'], ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, {
    username: config.slack.username,
    icon_url: config.slack.icon_url,
    text: 'こんにちは！',
  });
});

controller.hears([/^pr\s+list(?:\s+(\S+))?\s*$/], ['direct_mention', 'mention'], (bot, msg) => {
  let repo = msg.match[1] || '';
  let getPR = async () => {
    let pr = await PR.list('CANARIA', repo);
    if (pr.data.length > 0) {
      let fields = pr.data.map((e) => {
        return {
          'title': e.title,
          'value': e.html_url,
        }
      });
      bot.reply(msg, {
        username: config.slack.username,
        icon_url: config.slack.icon_url,
        attachments: [{
          fields: fields,
        }],
      })
    } else {
      bot.reply(msg, {
        username: config.slack.username,
        icon_url: config.slack.icon_url,
        attachments: [{
          text: 'PRはありません',
          color: '#ff0000',
        }],
      });
    }
  };

  getPR().catch(err => {
    console.log(err);
    bot.reply(msg, {
      username: config.slack.username,
      icon_url: config.slack.icon_url,
      attachments: [{
        text: 'GitHubAPIにエラーが発生しました. リポジトリ名は合っていますか？\npr list [repo_name] で入力してください\n',
        color: '#ff0000',
      }],
    });
  });
});

// pr create release [repo_name] [newReleaseBranchName]
controller.hears([/^pr\s+create\s+release(?:\s+(\S+)\s+(\S+))?\s*$/], ['direct_mention', 'mention'], (bot, msg) => {
  let repo = msg.match[1] || '';
  let newReleaseBranchName = msg.match[2] || '';
  const createRelease = async () => {

    let branchInfo = await PR.getRef('CANARIA', repo, 'develop').catch(err => { throw new Error(err) });

    await PR.create('CANARIA', repo, `refs/heads/${newReleaseBranchName}`, branchInfo.data.object.sha).catch(err => { throw new Error(err) });

    let releaseCreated = await PR.release('CANARIA', repo, newReleaseBranchName).catch(err => { throw new Error(err) });

    bot.reply(msg, {
      username: config.slack.username,
      icon_url: config.slack.icon_url,
      attachments: [{
        fields: [
          {
            title: 'releasePR was created',
            value: releaseCreated.data.html_url,
          }
        ],
      }],
    });
  };

  createRelease()
    .catch(err => {
      console.log(err);
      bot.reply(msg, {
        username: config.slack.username,
        icon_url: config.slack.icon_url,
        attachments: [{
          text: 'releasePR: failed to create',
          color: '#ff0000',
        }],
      });
    });
});
