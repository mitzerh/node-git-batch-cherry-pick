#!/usr/bin/env node

var dir = __dirname,
    _ = require('lodash'),
    shell = require('shelljs'),
    lodash = require('lodash'),
    stripAnsi = require('strip-ansi'),
    Helper = require(dir + '/helper');

    // ticket - REQUIRED
var GIT_REGEX = Helper.getOpt('regex') || false,
    // repo path
    GIT_PATH = Helper.getOpt('repo') || './',
    // author
    GIT_AUTHOR = Helper.getOpt('author') || false,
    // how many number of logs prior to search
    GIT_LOG_LINES = Helper.getOpt('nlogs') || 5000;

if (!GIT_REGEX) {
    log('requires a regex!\n');
    return false;
}

// regex condition
function requiredCondition(comment) {
    var re = new RegExp(GIT_REGEX);
    return re.test(comment);
}

function runGitCmd(cmd) {

    var res = shell.exec([
        'cd ' + GIT_PATH,
        cmd,
        'cd ' + dir
    ].join(' && '), { silent: true });

    return res;

}

// display repo branch
var currBranch = runGitCmd('git branch 2> /dev/null | sed -e \'/^[^*]/d\' -e \'s/* \(.*\)/ (\1)/\'');

if (currBranch.output.length < 1) {
    log('The path @ ' + GIT_PATH + ' is not a GIT repository..\n');
    return false;
} else {
    if (GIT_PATH !== './') {
        log('Repository directory      :', GIT_PATH);
    }
    log('Repository current branch :', (stripAnsi(currBranch.output)).replace(/[^a-z0-9\-_\/]/g, ''));
}


// process output
var ITEMS = (function(){

    var arr = [],
        // run git command to get logs
        cmd = 'git log --format="%h|@@|%cn|@@|%s" ' + ((GIT_LOG_LINES && GIT_LOG_LINES !== 'all') ? ('-' + GIT_LOG_LINES) : ''),
        res = runGitCmd(cmd),
        output = stripAnsi(res.output);

    if (res.code !== 0) {

        log('Error in execution.. (code='+res.code+')');
        log(res);

    } else if (output.length > 1) {
        
        var items = output.split('\n'),
            found = [];

        items.forEach(function(item){

            item = _.trim(item);

            if (item.length > 1) {

                var sp = item.split('|@@|'),
                    hash = sp[0],
                    author = sp[1],
                    comment = sp[2];

                if (hash && comment && comment.length > 0) {

                    // if regex found
                    if (requiredCondition(comment)) {

                        var info = {
                            hash: hash,
                            author: author,
                            comment: comment
                        };

                        // if there's an author
                        if (GIT_AUTHOR && (author.toLowerCase()).indexOf(GIT_AUTHOR.toLowerCase()) > -1) {
                            found.push(info);
                        } else if (!GIT_AUTHOR) {
                            found.push(info);
                        }
                    }

                }

            }

        });

        if (found.length > 0) {

            var hashArr = [];

            // print out commits
            log('\nCommits' + ((GIT_AUTHOR) ? 'by author search "'+GIT_AUTHOR+'"' : '') + ':' );
            found.forEach(function(item){
                log(item.hash, item.comment, '(by: '+item.author+')');
                hashArr.push(item.hash);
            });

            // build cherry-pick command
            log('\nGIT CHERRY PICK COMMAND:');
            var cmdArr = [];
            hashArr.reverse();
            hashArr.forEach(function(hs, i){
                //cmdArr.push('git cherry-pick --strategy=recursive -X theirs ' + ((i === 0) ? '--no-commit ' : '') + hs);
                cmdArr.push('git cherry-pick --strategy=recursive -X theirs ' + hs);
            });
            log(cmdArr.join(' && '));
            log('');

        } else {
            log('No commits found for regex: ' + GIT_REGEX);
            if (GIT_AUTHOR) {
                log('With author: ' + GIT_AUTHOR + '\n');
            }
        }


    }

    return arr;


}());

function log() {
    var args = Array.prototype.slice.call(arguments);
    console.log.apply(console, args);
}
