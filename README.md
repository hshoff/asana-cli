asana-cli
=========

A CLI for Asana.<br/>
This has been updated and tested with Asana API 1.0 in july 2020.

<br/>


## Install
==========

1. `git clone git@github.com:h4rry/asana-cli.git`
2. `npm install -g .`
3. Edit `config-template.json` and put your [Asana API Key](http://app.asana.com/-/account_api) in there. Then rename `config-template.json` to `config.json` when you are done.

<br/>

## Usage
=========

	  Usage: asana [options] <cmds>
	
	  Commands:
	
	    me 
	     -- Current user
	    
	    tasks 
	      -- list all tasks assigned to you
	    
	    cd 
	     -- Change directory
	    
	    ls 
	     -- List all in current directory
	    
	    projects 
	     -- List all projects
	     
	    api <method> <urlargs>
	    -- Calls the Asana raw API 1.0, according to https://developers.asana.com/explorer
	    -- example : bin/asana.js api GET '/users/me'
	    -- example : bin/asana.js api GET '/projects/1234567890/tasks'
	    -- note : do not forget to put 'urlargs' in simple quotes
	
	  Options:
	
	    -h, --help     output usage information
	    -V, --version  output the version number
	    
<br/>

## License
===========
(The MIT License)

Copyright (c) 2011 Harrison Shoff <hi@hshoff.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
