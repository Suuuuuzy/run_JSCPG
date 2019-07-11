var growl = require('./growl'),
    GitHubApi = require('github');

module.exports.github = new GitHubApi({
    version: '3.0.0'
});

module.exports.growl = function(title, description) {
    growl(description, {
        title: title
    }, function(err) {
        if (err) throw err;
    });
};

module.exports.parseEvent = function(event) {
    var that = this;
    console.log('DEBUG', event.type);
    switch (event.type) {
        case 'CommitCommentEvent':
            break;
        case 'CreateEvent':
            break;
        case 'DeleteEvent':
            break;
        case 'DownloadEvent':
            break;
        case 'GollumEvent':
            break;
        case 'IssueCommentEvent':
            title = title = 'Issue #' + event.payload.issue.number;
            title = title + ' - ' + event.payload.issue.title;
            description = description + 'New comment by @' + event.actor.login;
            description = description + '\n';
            description = description + event.payload.issue.html_url;
            description = description + '#issuecomment-';
            description = description + event.payload.comment.id;
            break;
        case 'IssuesEvent':
            break;
        case 'MemberEvent':
            break;
        case 'PullRequestEvent':
            break;
        case 'PullRequestReviewCommitEvent':
            break;
        case 'PushEvent':
            break;
        case 'TeamAddEvent':
            break;
        default:
            title = title + 'Github Notification';
            description = title + 'An event occured on Github, go check it out!';
    }
    that.growl(gravatar, title, description);
};

var monitorEvents = function(type, options) {
    var that = this;
    that.github.events.getFromUser({
        user: options.username
    }, function(err, events) {
        var event = events[0]
        that.parseEvent(event);
    });
};

module.exports.monitorEvents = monitorEvents;

monitorEvents({
    username: username,
    password: password,
    interval: interval
});
