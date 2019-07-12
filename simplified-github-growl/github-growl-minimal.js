var growl = require('./growl'),
    GitHubApi = require('github');

var github = new GitHubApi({
    version: '3.0.0'
});

var myGrowl = function(title, description) {
    growl(description, {
        title: title
    }, function(err) {
        if (err) throw err;
    });
};

var parseEvent = function(event) {
    title = 'Issue #' + event.payload.issue.number;
    title = title + ' - ' + event.payload.issue.title;
    description = description + 'New comment by @' + event.actor.login;
    description = description + '\n';
    description = description + event.payload.issue.html_url;
    description = description + '#issuecomment-';
    description = description + event.payload.comment.id;
    myGrowl(gravatar, title, description);
};

var monitorEvents = function(options) {
    var that = this;
    that.github.events.getFromUser({
        user: options.username
    }, function(err, events) {
        var event = events[0];
        parseEvent(event);
    });
};

module.exports.github = github;
module.exports.growl = myGrowl;
module.exports.parseEvent = parseEvent;
module.exports.monitorEvents = monitorEvents;

monitorEvents({
    username: username,
    password: password,
    interval: interval
});
