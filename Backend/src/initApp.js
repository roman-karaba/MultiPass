const MongoClient = require('mongodb');
const bcrypt = require('bcrypt');
const usersJSON = require('./usersJSON');
const fetch = require('node-fetch');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'multipass';
const serverUrl = 'http://127.0.0.1:3000';
const multichainOptions = require('./multichainOptions');
const multichain = require('multichain-node')(multichainOptions);

// initialize users in mongoDB

async function SignUp(credentials) {
  try {
    const response = await fetch(`${serverUrl}/SignUp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    return response;
  } catch (error) {
    console.log(error);
    return { status: 500 };
  }
}

// Clear the users collection if it exists
async function clearUsers(callback) {
  await MongoClient.connect(mongoUrl, { useNewUrlParser: true }, async (err, client) => {
    const db = client.db(dbName);
    await db.collection('users').drop((delErr, delOK) => {
      if (delErr) console.log('Users collection is empty');
      if (delOK) console.log('Users have been deleted');
      client.close();
      callback();
    });
  });
}

// Hash passwords from usersJSON and add users to mongoDB
async function addUsers() {
  try {
    const streamList = await multichain.listStreams();
    if (streamList.length === 1) {
      console.log('creating users and courses streams');
      console.log(await multichain.create({ type: 'stream', name: 'users', open: true }));
      console.log(await multichain.create({ type: 'stream', name: 'courses', open: true }));
    }

    for (const user of usersJSON) {
      console.log(await SignUp(user));
    }
  } catch (err) {
    console.log(err);
  }
}


clearUsers(addUsers);
