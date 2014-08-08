var ldap = require('ldapjs');

var ldap_port = parseInt(process.env.STACKATO_HARBOR_LDAP_PORT) || 1389;
var ldap_host = '0.0.0.0';

var server = ldap.createServer();

var SUFFIX = 'dc=example, dc=com';

var userdb = {
  'stackato' : { samaccountname: 'stackato', email: 'stackato@stackato.com', password: 'stackato' },
  'testuser1' : { samaccountname: 'testuser1', email: 'testuser1@stackato.com', password: 'stackato' },
  'testuser2' : { samaccountname: 'testuser2', email: 'testuser2@stackato.com', password: 'stackato' },
  'testuser3' : { samaccountname: 'testuser3', email: 'testuser3@stackato.com', password: 'stackato' },
};

var groupdb = [
  {cn:'stackato-admin', objectclass: 'posixgroup', memberuid:'stackato' },
  {cn:'stackato-user', objectclass: 'posixgroup', memberuid:'testuser1' },
  {cn:'stackato-user', objectclass: 'posixgroup', memberuid:'testuser2' },
  {cn:'some-other-group', objectclass: 'posixgroup', memberuid:'testuser2' },
  {cn:'some-other-group', objectclass: 'posixgroup', memberuid:'testuser3' }
];

var user = {};

server.search(SUFFIX, function(req, res, next) {
  user.dn = req.dn.toString();
  
  // check if this is a user query
  Object.keys(userdb).forEach( function(uid){
    if (req.filter.matches(userdb[uid])){
      user.attributes = userdb[uid];
      console.log('found user ' + uid);
      res.send(user);
      res.end();
      return next();
    }
  });

  // check if this is a group query
  groupdb.forEach( function(group) {
    if (req.filter.matches( group ) ) {
      console.log("Group query matched " + group.cn );
      var group_resp = {}
      group_resp.dn = req.dn.toString();
      group_resp.attributes = group;
      res.send(group_resp);
      res.end();
      return next();
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

var service_info;
if(process.env.STACKATO_SERVICES){
  var services = JSON.parse(process.env.STACKATO_SERVICES);
  service_info = services['ldap-port']['protocol'][0] + 
      "://" + services['ldap-port']['hostname'] + 
      ":" + services['ldap-port']['port'];
}

server.listen(ldap_port, ldap_host, function() {
  console.log('LDAP server listening at:');
  if(service_info){
    console.log(service_info);
  } else {
    console.log('LDAP server listening at %s', server.url);
  }
});

// for Stackato
if(process.env.PORT){
  var http_port = parseInt(process.env.PORT);
  var http = require('http');
  http.createServer(function (req, res) {
      res.writeHead(200);
      res.write('LDAP Server OK\n');
      if(service_info){
        res.write("LDAP Server:");
        res.write(service_info);
      }
      res.end();
  }).listen(http_port);
}
