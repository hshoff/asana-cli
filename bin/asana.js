#!/usr/bin/env node

var program = require('commander'),
    request = require('superagent'),
    colors  = require('colors'),
    archy   = require('archy'),
    _       = require('underscore'),

    fs      = require('fs'),
    exec    = require('child_process').exec,
    spawn   = require('child_process').spawn,

    CONFIG  = JSON.parse(fs.readFileSync('./config.json')),
    ASANA_KEY = CONFIG['API_KEY'],
    ASANA   = CONFIG['API_URL'] + CONFIG['API_VERSION'];


/**
 * Asana CLI
 */
program
  .version('0.0.1')
  .usage('[options] <cmds>');

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
    me();
  });

program
  .command('tasks')
  .description('  -- list all tasks assigned to you')
  .action(function(){
    tasks();
  });

program
  .command('cd')
  .description(' -- Change directory')
  .action(function(){
    cd();
  });

program
  .command('ls')
  .description(' -- List all in current directory')
  .action(function(){

  });

program
  .command('projects')
  .description(' -- List all projects')
  .action(function(){
    projects();
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

function cd() {
  var dir = _.first(program.args);
  console.log(dir);
}

function projects() {
  request
    .get(ASANA+'/projects')
    .auth(ASANA_KEY,'')
    .end(function(res){
      var data = res['body']['data'];
      printChildren(data, 'Projects')
    });
}

function workspaces() {
  request
    .get(ASANA+'/workspaces')
    .auth(ASANA_KEY,'')
    .end(function(res){
      var data = res['body']['data'];
      printChildren(data, 'Workspaces')
    });
}

function tasks() {
  request
    .get(ASANA + '/tasks')
    .query({ assignee: 'me' })
    .auth(ASANA_KEY,'')
    .end(function(res){
      var data = res['body']['data'];
      printChildren(data, 'Tasks')
    });
}

function me() {
  request
    .get(ASANA + '/users/me')
    .query({opt_pretty: 'true'})
    .auth(ASANA_KEY,'')
    .end(function(res){
      if (res.ok) {
        var data = res.body['data'];

        print('    name: '.blue+data['name'],
              '    email: '.blue+data['email'],
              '    id: '.blue+data['id']);

        if (data['workspaces']) {
          printChildren(data['workspaces'], 'Workspaces');
        }

        projects();
      }
    });
}

function printChildren(data, label) {
  var nodes, s;
  data = _.toArray(data);

  // map workspace.name => nodes.label for
  // archy support.
  nodes = _.map(data, function(d) {
    return {'label': d['name']}
  });

  s = archy({
    label: label.green,
    nodes: nodes
  }, "    ");

  print(s);
}

function print() {
  console.log('');
  _.each(arguments, function(arg){
    console.log(arg);
  })
}