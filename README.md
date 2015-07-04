# myapp 
## Environment configuration
`npm install -g express-generator` 
// install express-generator globally 

`express --ejs -f` 
//generate express with ejs engine and force the install

`npm install` 
//install the dependency in package.jason
`bin/www`
// to lauch the server, type bin/www in the terminal and use Preview/Preview running application to see result

`git add *` 
//adding all files/folers recursively in the git local repo

`git commit -m "custom commit message"` 
//commit those added files in the git local repo

`git push origin master` 
//push the changes to the remote repo in github 

`username: jianzhengwu  ; password: banjiwujing`

To ignore node_modules folder from git, one can use .gitignore or exclude in .git/info/ignore

Updating NPM:
$ npm update -g npm
Updating Grunt:
$ npm update -g grunt-cli
Updating Bower:
$ npm update -g bower

Cleaning NPM and Bower cache
NPM and Bower has a caching system for holding packages that you already installed. We found that often cleaning the cache solves some troubles this system creates.
NPM Clean Cache:
$ npm cache clean
Bower Clean Cache:
$ bower cache clean

