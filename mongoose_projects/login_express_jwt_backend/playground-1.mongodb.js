
use('admin');
db.auth("mongoTestAdmin", "test-mongo-database");

use('blog');

use('posts');

db.users.findOneAndDelete({"username":"test"});
db.users.find({});