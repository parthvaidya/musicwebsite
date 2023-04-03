//import AWS from 'aws-sdk';


const AWS = require('aws-sdk');
AWS.config.logger = console;
AWS.config.logger.level = 'debug';


            



AWS.config.update({
    region: 'us-east-1',
    // credentials: {
    //   accessKeyId: 'ASIAT2SZTRLJOBTBVFQM',
    //   secretAccessKey: 'y0yKF0UkXhD2TZnij+3FSudEDatg1vB+nMeWaCAb',
    //   sessionToken  : 'FwoGZXIvYXdzEA0aDOVogX2CL/duMb2InSLNAUhMm4RDdsEljsHqrVij6pgQ8KiQXI5tfVoVqBFBm5XEY2WLMzOXKSyAxW4lqFwu1Pt8YpVgjqU5ORMUeeW+9LxxvqjRuj/loDrjNVHUbP/ORSglA0xBfw5fKOc9RjSj+cA0lAppTOZEndjXfZIKPnfkGAhiBRScq6lOXwATsRdkb37zlvHJrj2SpJJMx7m775MK5M9f6NSwguEpVH/g7w/AuRw6i19EI/zxGKlXNfTyIzsXvLEO51pZjf17thSpwWV38EjA1L0UyiTRMJcohvuqoQYyLfwtne1U+/218YOtmIJ20zBmGPyoZQPfSTUr7yQuairUx+cCC0JdG9+FxyYhUA=='}
    
    
  }
  
  );
  
  console.log('AWS configuration:', AWS.config);
const docClient = new AWS.DynamoDB.DocumentClient();

export const getUserByEmail = (email, password, callback) => {
  const params = {
    TableName: 'login',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
      
      
    },
    ProjectionExpression: 'email, user_name, password, subscribedartist '

  };
  console.log(email);
  console.log(password);
  

  docClient.query(params, (err, data) => {
    if (err) {
      console.error('Unable to get user', err);
      callback(err, null);
      //alert("Login Failed. Please try again.");
    } else {
      console.log('User retrieved successfully', data);
      const user = data.Items[0];
      if (user && user.password === password) {
        callback(null, user);
        console.log(user.subscribedartist);
        //console.log(password);
      } else {
        callback(new Error('Invalid email or password'), null);
      }
    }
  });
};




export const addUser = (user_name, email, password, callback) => {
 
  const params = {
    TableName: 'login',
    Item: {
      email: email,
      user_name: user_name,
      password: password,
    },
  };

  docClient.get({ TableName: 'login', Key: { email: email } }, (err, data) => {
    if (err) {
      console.error('Unable to read item', err);
      callback(err, null);
    } else if (data.Item) {
      console.log('User already exists', data.Item);
      alert('This email already exists. Please use another mail');
      callback(null, null);
    } else {
      docClient.put(params, (err, data) => {
        if (err) {
          console.error('Unable to add user', err);
          callback(err, null);
        } else {
          console.log('User added successfully', data);
          alert('User added successfully');
          callback(null, data);
          //history.push('/login');
        }
      });
    }
  });
};


