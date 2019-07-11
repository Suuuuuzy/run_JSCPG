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

module.exports.monitorEvents = function(type, options) {
    var that = this;
    that.github.events.getFromUser({
        user: options.username
    }, function(err, events) {
        var event = events[0]
        that.parseEvent(event);
    });
};

module.exports.authenticate = function(options) {
    this.github.authenticate({
        type: 'basic',
        username: options.username,
        password: options.password
    });
};

module.exports.repos = {
    user: {},
    organization: {}
};

module.exports.getUserRepos = function(options) {
    var that = this;
    that.github.repos.getFromUser({
        user: options.username,
        type: 'all'
    }, function(err, data) {
        if (err) throw err;
        /*
        // NOTE: This doesn't really work since repo properties change quite often
        if (!_.isEqual(that.repos.user, data)) {
          console.log('  ✔'.green + '  Updated list of user repositories');
          that.repos.user = data;
        }
        */
        that.repos.user = data;
        that.monitorEvents('user', options);
        setTimeout(function() {
            that.getUserRepos(options);
        }, options.interval);
    });
};

module.exports.monitor = function(options) {

    // Load options object
    options = options || {};

    // Ensure all required options are passed
    var required = ['username', 'password', 'interval'];
    required.forEach(function(val) {
        if (typeof options[val] === 'undefined') {
            console.log('  ✗'.red + '  Missing ' + val);
            return process.exit(1);
        }
    });

    // Ensure that interval is not going to cause rate limiting errors
    if (options.interval < 5000) {
        console.log('  ✗'.red + '  Rate limiting prevention b/c interval < 5s');
        return process.exit(1);
    }

    // Authenticate user
    this.authenticate(options);

    // Monitor user's repositories
    this.getUserRepos(options);

};