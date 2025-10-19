module.exports = {
  apps : [{
    script: './src/index.js',
    name   : "andygracespace_api",
    watch: '.'
  }],

  deploy : {
    production : {
      user : 'root',
      host : 'andygrace.space',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
