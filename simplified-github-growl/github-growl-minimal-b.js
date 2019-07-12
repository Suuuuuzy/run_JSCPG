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
