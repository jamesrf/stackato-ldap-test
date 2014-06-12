# LDAP Test Server

This server is useful for testing Stackato authenticating against LDAP

## To Run

```bash
$ npm install
$ npm start
```

Server will listen on the given port.  If you are deploying on Stackato, check the env variables to see which harbor port it is listening on

## Configuration

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
