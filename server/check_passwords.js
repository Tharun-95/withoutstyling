const connectDB = require('./config/db');
const Userlogin = require('./models/Userlogin');
const dotenv = require('dotenv');

dotenv.config();

const checkPasswords = async () => {
  try {
    await connectDB();
    const users = await Userlogin.find({});
    console.log(`Found total ${users.length} users in database.`);
    
    let plaintextCount = 0;
    for (const user of users) {
      if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
        console.log(`[!] User '${user.username}' (${user.email}) has a PLAIN TEXT password: "${user.password}"`);
        plaintextCount++;
      }
    }
    
    if (plaintextCount > 0) {
      console.log(`\nFound ${plaintextCount} users with plain text passwords. They will fail login because bcrypt expects hashed passwords.`);
      console.log(`Deleting these plain text users now so you can sign up again properly...`);
      await Userlogin.deleteMany({ password: { $not: /^\$2[ab]\$/ } });
      console.log('Successfully deleted users with plain text passwords.');
    } else {
      console.log('All user passwords appear to be correctly hashed with bcrypt.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
};

checkPasswords();
