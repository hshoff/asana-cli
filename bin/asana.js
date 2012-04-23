#!/usr/bin/env node

var program = require('commander'),
    request = require('superagent'),
    colors  = require('colors'),
    archy   = require('archy'),
    _       = require('underscore'),

    exec    = require('child_process').exec
    spawn   = require('child_process').spawn,

    API_VERSION = '1.0',
    API_URL = 'https://app.asana.com/api/' + API_VERSION,
    API_KEY = process.env.ASANA_API_KEY,
    INDENT  = "  ",

    authorized = false,
    me = {};


/**
 * Asana CLI
 */
program
  .version('0.0.1')
  .usage('[options] <args>');

program
  .command('install')
  .description('  -- Install the app globally')
  .action(function(){
    console.log('\n');
    exec('npm install -g asana', puts)
  });

program
  .command('me')
  .description(' -- Current user')
  .action(function(){
    setMe(true);
  });

program
  .command('tasks')
  .description('  -- list all tasks assigned to you')
  .action(function(){
    tasks();
  });

program.parse(process.argv);

/**
 * Functions
 */

function puts(error, stdout, stderr) {
  stream(error);
  stream(stdout);
  stream(stderr);
}

function stream(data) {
  if (data) console.log(data);
}

function setMe(verbose) {
  var verbose = verbose || false;

  request
    .get(API_URL + '/users/me')
    .query({opt_pretty: 'true'})
    .auth(API_KEY,'')
    .end(function(res){
      if (res.ok) {
        me = res.body['data'];
        if (verbose) {
          console.log('');
          console.log('name: '.blue+me['name']);
          console.log('email: '.blue+me['email']);
          console.log('id: '.blue+me['id']);
          console.log('');
          if (me['workspaces']) {
            printWorkspaces(me['workspaces']);
          }
        }
      }
    });
}

function printWorkspaces(workspaces) {
  var nodes, s;

  workspaces = _.toArray(workspaces);

  // map workspace.name => nodes.label for
  // archy support.
  nodes = _.map(workspaces, function(workspace) {
    return {'label': workspace['name']}
  });

  s = archy({
    label: 'Workspaces'.green,
    nodes: nodes
  }, INDENT+INDENT);

  console.log(s);
}