# LDAP Test Server

This server is useful for testing Stackato authenticating against LDAP

## To Run

```bash
$ npm install
$ npm start
```

Server will listen on the given port.  If you are deploying on Stackato, check the env variables to see which harbor port it is listening on

## Configuration

To setup your Stackato instance:
```bash
$ kato config set aok strategy/ldap/host <host-of-this-server>
$ kato config set aok strategy/ldap/port <port-of-this-server>
$ kato config set aok strategy/ldap/group_query "(&(objectClass=posixGroup)(memberUid=%{username}))"
$ kato config set aok strategy/ldap/group_attribute "cn"
$ kato config set aok strategy/ldap/allowed_groups "[\"stackato-admin\",\"stackato-user\"]"
$ kato config set aok strategy/ldap/admin_groups "[\"stackato-admin\"]"
$ kato config set aok strategy/use "ldap"
```


field       | value
------------|--------------
LDAP base   | 'dc=example, dc=com'
uid         | samaccountname
group       | posixgroup
email       | email

Default setup includes the following users:

Username      |      Email              | Password   | Groups                           
--------------|-------------------------|------------|----------------------------------
stackato      | stackato@stackato.com   | stackato   | stackato-admin                   
testuser1     | testuser1@stackato.com  | stackato   | stackato-user                    
testuser2     | testuser2@stackato.com  | stackato   | stackato-user, some-other-group  
testuser3     | testuser3@stackato.com  | stackato   | some-other-group                 
