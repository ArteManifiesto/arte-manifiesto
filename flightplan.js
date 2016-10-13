var plan = require('flightplan');

var appName = 'am-app';
var username = 'deploy';
var startFile = './app';

var tmpDir = appName + '-' + new Date().getTime();

// configuration
// plan.target('staging', [
//   {
//     host: '159.203.120.86',
//     username: username,
//     agent: process.env.SSH_AUTH_SOCK
//   }
// ]);

plan.target('production', [
  {
    host: '159.203.120.86',
    username: username,
    password: 'D3ayU4?2mhAU8Qn^r)YZ@XP#ycw3NH7jk6',
    agent: process.env.SSH_AUTH_SOCK
  },
// {
// host: '159.203.120.86',
//   username: username,
//   agent: process.env.SSH_AUTH_SOCK
// }
]);

plan.local(function (local) {
  local.log('Copy files to remote hosts');
  var filesToCopy = local.exec('git ls-files', {silent: true});
  local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

plan.remote(function (remote) {
  remote.log('Move folder to root');

  remote.sudo('cp -R /tmp/' + tmpDir + ' ~', {user: username});
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('rename production to .env');
  remote.mv(tmpDir + '/production -f .env', {user: username});

  remote.log('rename the default config');
  remote.mv(tmpDir + '/config/config-production.json -f ' + tmpDir +'/config/config.json', {user: username});

  remote.log('Install dependencies');
  remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir, {user: username});

  // remote.exec('cd  ~/' + tmpDir);
  // remote.sudo('sequelize db:migrate --env production', {user: username});

  remote.log('Reload application');
  remote.sudo('ln -snf ~/' + tmpDir + ' ~/' + appName, {user: username});
  remote.exec('pm2 stop all', {failsafe: true});
  remote.exec('pm2 start ~/' + appName + '/' + startFile + ' --name=' + appName);
});
//
//
// plan.remote('rollback', function(remote){
//   var backups, selectedBackup;
//
//   remote.with('cd ~', function(){
//     backups = remote.find('-type d -maxdepth 1');
//   });
//
//   selectedBackup = remote.prompt("Select a backup:");
//   remote.exec('ln -s ~/' + selectedBackup.replace('./', '') + ' current');
// });
