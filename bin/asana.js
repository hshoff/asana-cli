#!/usr/bin/env node

var program = require('commander'),
    request = require('superagent'),
    colors  = require('colors'),
    archy   = require('archy'),
    _       = require('underscore'),

    fs      = require('fs'),
    exec    = require('child_process').exec,
    spawn   = require('child_process').spawn,

    CONFIG    = JSON.parse(fs.readFileSync('./config.json')),
    ASANA_KEY = CONFIG['API_KEY'],
    ASANA     = CONFIG['API_URL'] + CONFIG['API_VERSION'];


/**
 * Asana CLI
 */
program
  .version('0.0.2')
  .usage('[options] <cmds>');

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

program
  .command('api <method> <urlargs>')
  .description(' -- Make a raw API call (eg asana.js api GET \'/users?limit=10\' - see https://developers.asana.com/explorer')
  .action((method, urlargs) => {
    api(method, urlargs);
  });

program
  .command('run')
  .description(' -- Run a sequence of commands')
  .action(() => {
    run();
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
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer ' + ASANA_KEY)
    .then(res => {
      var data = res['body']['data'];
        printChildren(data, 'Projects')
    });
}

function workspaces() {
  request
    .get(ASANA+'/workspaces')
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer '+ASANA_KEY)
    .then(res => {
      var data = res['body']['data'];
      printChildren(data, 'Workspaces')
    });
}

async function tasks() {
  let workspacegid

  // Get first workspace
  await request
    .get(ASANA + '/workspaces')
    .query({ assignee: 'me' })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer '+ASANA_KEY)
    .then(res => {
      var data = res['body']['data'];
      workspacegid=data[0].gid
    })
    .catch(err => {
      print(err.message);
      print(err.response.text);
    })

  print(workspacegid)

  // Get tasks from that workspace
  await request
    .get(ASANA + '/tasks')
    .query({ assignee: 'me' })
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer '+ASANA_KEY)
    .then(res => {
      var data = res['body']['data'];
      printChildren(data, 'Tasks')
    })
    .catch(err => {
      print(err.message);
      print(err.response.text);
    })
}

function me() {
  request
    .get(ASANA + '/users/me')
    .query({opt_pretty: 'true'})
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer '+ASANA_KEY)
    .then(res => {
      if (res.ok) {
        var data = res.body['data'];

        print('    name:  '.blue+data['name'],
              '    email: '.blue+data['email'],
              '    gid:   '.blue+data['gid']);

        if (data['workspaces']) {
          printChildren(data['workspaces'], 'Workspaces');
        }

        projects();
      }
    });
}

async function api(method, urlargs) {
  let data 

  await request(method, ASANA + urlargs)
    .set('Accept', 'application/json')
    .set('Authorization', 'Bearer '+ASANA_KEY)
    .then(res => {
      if (res.ok) {
        data = res.body['data'];
      }
    })
    .catch(err => {
      print(err.message);
      print(err.response.text);
    });

  return data;
}

function printChildren(data, label) {
  var nodes, s;
  data = _.toArray(data);

  // map workspace.name => nodes.label for
  // archy support.
  nodes = _.map(data, function(d) {
    return {'label': d['gid'] +' : '+ d['name']}
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

async function run() {
  let projects = await api('GET', '/projects');
  let pid      = projects[0].gid;
  let tasks    = await api('GET', '/projects/'+pid+'/tasks');

  print(tasks)
}