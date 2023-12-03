// Create an admin user for database authentication

/*
// Select the database to use.
use('admin');

// Clear the current database
db.createUser({
    user:"mongoTestAdmin",
    pwd: "test-mongo-database",
    roles: [
        { role: "userAdminAnyDatabase", db: "admin"},
        { role: "readWriteAnyDatabase", db: "admin"}
    ]
});

// Print a message to the output window.
console.log(`Authorization user added successfully!`);
*/

// Authenticate as newly created admin user
use('admin');
db.auth("mongoTestAdmin", "test-mongo-database");

use('blog');

use('posts');

//db.users.find({});
db.roles.find({});




// Remove a User (authentication is required)
// Be Aware Lockout is Possible on non local hosts 
//db.dropUser("mongoTestAdmin");