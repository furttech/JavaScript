# SCRAM Authentication on Mongodb

This project explores the use of basic authentication on a mongodb database server.

## Configure the Database

**The userAdminAnyDatabase role allows this user to:**

    - create users

    - grant or revoke roles from users

    - create or modify customs roles

You can assign your user additional built-in roles or user-defined roles as needed using the below query.

```javascript
// example for creating a user under the localhost/admin user
use admin
db.createUser(
  {
    user: "myUserAdmin",
    pwd: passwordPrompt(), // or cleartext password
    roles: [
      { role: "userAdminAnyDatabase", db: "admin" },
      { role: "readWriteAnyDatabase", db: "admin" }
    ]
  }
)

// shutdown the server and restart
db.adminCommand( { shutdown: 1 } )

```
## Connect as __New__ Authenticated User

Authentication is performed Two Ways

1. During Connection:
  * The username and password are sent with the startup string
2. After Connection:
  * The username and password is passed within a database query

```bash
 // startup script
 mongosh --port 27017  --authenticationDatabase "admin" -u "myUserAdmin" -p
```

```javascript
 // select admin database
 use admin

 // pass authentication
 db.auth("myUserAdmin", passwordPrompt()) // or cleartext password
```

### TIP: The passwordPrompt() method prompts you to enter the password. You can also specify your password directly as a string. We recommend to use the passwordPrompt() method to avoid the password being visible on your screen and potentially leaking the password to your shell history.