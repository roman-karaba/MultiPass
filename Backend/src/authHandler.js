import MongoClient from 'mongodb';
import bcrypt from 'bcrypt';
import { GenerateToken, VerifyToken, StrToHex } from './helpers';

const multichainOptions = require('./multichainOptions');
const multichain = require('multichain-node')(multichainOptions);

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'multipass';

module.exports.SignUp = (request, response) => {
  const signupData = request.body;
  try {
    // Connect to MongoDB
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, async (err, client) => {
      if (err) {
        console.log('===== SIGNUP ERROR =====\ncould not connect to db');
        request.status(500).send({ message: 'Internal server error' });
        // console.log(err);
        return;
      }

      try {
        // Specify collection and query the DB
        const db = client.db(dbName);
        const users = await db.collection('users')
          .find({ matriculationId: signupData.matriculationId })
          .toArray();

        // Check the query result for users with a matching Matriculation ID
        if (users.length !== 0) {
          console.log(`user with the matriculation Id: ${signupData.matriculationId} already exists!`);
          // Status code 409 - Conflict
          response.status(409).send({ message: 'User already exists' });
          client.close();
          return;
        } else {
          // Hash password and store hash into db
          bcrypt.hash(signupData.password, 10, (hashErr, hashRes) => {
            const dbData = Object.assign({}, signupData);
            dbData.password = hashRes;
            db.collection('users').insertOne(dbData);
            // Status code 200 - OK
            client.close();
          });

          // Create user in the chain
          const { firstName, lastName, userType } = signupData;
          const completedCourses = [];
          const courses = {};
          const courseEntries = {};
          const dataStr = JSON.stringify({
            firstName, lastName, userType, completedCourses, courseEntries, courses
          });
          const publishUser = await multichain.publish({
            stream: 'users',
            key: signupData.matriculationId,
            data: StrToHex(dataStr)
          });

          console.log(publishUser);
          response.status(200).send({ message: 'OK' });
        }
      } catch (error) {
        console.log('===== SIGNUP ERROR =====\n Could not store data in db or chain');
        // console.log(error);
        response.status(500).send({ message: 'Internal Server Error' });
        client.close();
      }
    });
  } catch (error) {
    console.log('===== SIGNUP ERROR =====');
    // console.log(error);
    response.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports.Login = (request, response) => {
  const userData = request.body;
  try {
  // Connect to MongoDB and query for the user
    MongoClient.connect(mongoUrl, { useNewUrlParser: true }, async (dbErr, client) => {
      if (dbErr) {
        console.log('===== LOGIN ERROR =====\ncould not connect to db');
        // console.log(dbErr);
        response.status(500).send({ message: 'Internal Server Error' });
        return;
      }

      const db = client.db(dbName);
      const users = await db.collection('users')
        .find({ matriculationId: userData.matriculationId })
        .toArray();

      // Check if user exists
      if (users.length === 0) {
        response.status(400).send({ message: 'Wrong UserID or Password' });
        client.close();
        return;
      }

      // Check password if password ok, generate token, respond with token and code 200
      bcrypt.compare(userData.password, users[0].password, (hashErr, match) => {
        try {
          if (hashErr) {
            console.log('===== LOGIN ERROR =====\nerror when hashing the password');
            // console.error(hashErr);
            response.status(500).send({ message: 'Internal Server Error' });
            return;
          }
          if (match) {
            const token = GenerateToken(users[0]);
            response.status(200).send({ jwt: token });
          } else {
            response.status(400).send({ message: 'Wrong UserID or Password' });
          }
        } finally {
          client.close();
        }
      });
    });
  } catch (error) {
    console.log('===== LOGIN ERROR =====');
    console.log(error);
    response.status(500).send();
  }
};

// verify jwt on request, on ok => 200, on expired/invalid => 400
module.exports.Authenticate = (request, response) => {
  const token = request.body.jwt;
  const valid = VerifyToken(token);
  if (valid) {
    response.status(200).send();
  } else {
    response.status(401).send();
  }
};
