var ldap = require('ldapjs');

var server = ldap.createServer();

var SUFFIX = 'dc=example, dc=com';

var userdb = {
  'stackato' : { samaccountname: 'stackato', email: 'stackato@stackato.com', password: 'stackato' },
  'testuser' : { samaccountname: 'testuser', email: 'testuser@stackato.com', password: 'stackato' },
};

var user = {};

server.search(SUFFIX, function(req, res, next) {

  user.dn = req.dn.toString();
  
  Object.keys(userdb).forEach( function(uid){
    if (req.filter.matches(userdb[uid])){
      user.attributes = userdb[uid];
      console.log('found user ' + uid);
      res.send(user);
    }
  });

  res.end();
  return next();
});

server.bind(SUFFIX, function(req, res, next) {
  if(req.credentials !== user.attributes.password)
    return next(new ldap.InvalidCredentialsError());

  console.log( user.attributes.samaccountname + ' logged in');
  user = {};
  res.end();
  return next();
});

server.listen(1389, function() {
  console.log('LDAP server listening at %s', server.url);
});
