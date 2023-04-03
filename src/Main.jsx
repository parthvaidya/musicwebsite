import React, {useEffect, useState} from "react";
import { Login } from './Login';


const AWS = require('aws-sdk');
AWS.config.logger = console;
AWS.config.logger.level = 'debug';


            



AWS.config.update({
    region: 'us-east-1',
    // credentials: {
    //   accessKeyId: 'ASIAT2SZTRLJOBTBVFQM',
    //   secretAccessKey: 'y0yKF0UkXhD2TZnij+3FSudEDatg1vB+nMeWaCAb',
    //   sessionToken  : 'FwoGZXIvYXdzEA0aDOVogX2CL/duMb2InSLNAUhMm4RDdsEljsHqrVij6pgQ8KiQXI5tfVoVqBFBm5XEY2WLMzOXKSyAxW4lqFwu1Pt8YpVgjqU5ORMUeeW+9LxxvqjRuj/loDrjNVHUbP/ORSglA0xBfw5fKOc9RjSj+cA0lAppTOZEndjXfZIKPnfkGAhiBRScq6lOXwATsRdkb37zlvHJrj2SpJJMx7m775MK5M9f6NSwguEpVH/g7w/AuRw6i19EI/zxGKlXNfTyIzsXvLEO51pZjf17thSpwWV38EjA1L0UyiTRMJcohvuqoQYyLfwtne1U+/218YOtmIJ20zBmGPyoZQPfSTUr7yQuairUx+cCC0JdG9+FxyYhUA=='}
    
    
  });
  
//let flag = false;
  
const docClient = new AWS.DynamoDB.DocumentClient();

export const Main = ({user_name, email, subscribedartist} ) => {

    console.log("subscribedartist =",subscribedartist);
    const [redirect, setRedirection] = useState(false);

    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [year, setYear] = useState('');

    const [idList, setIdList] = useState([]);
    
    const [tableData, setTableData] = useState({});

    const [subscribedArtist, setSubscribedArtist] = useState([]);

    const [queriedArtist, setQueriedArtist] = useState([]);

    const [flag, setFlag] = useState(false);


    const fetchDetails = async() => {
      const params = (title, year) => ({
        TableName: "music",
        KeyConditionExpression: "#t = :title AND #yr= :year",
        ExpressionAttributeNames: {
         "#t" : "title",
         "#yr" : "year",
         "#ar" : "artist",
         "#img" : 'img_url'

        },
        ExpressionAttributeValues: {

          ":title": title,
          ":year": year,
          // ":artist" : subscribedartist[0].artist
          
        },
        ProjectionExpression: '#t, #yr, #ar , #img',
      })
      
      let movieitem = []
      
      


      const queries = subscribedartist.map(artist => (
        new Promise((resolve, reject) => {
          docClient.query(params(artist.title, artist.year), (err, data) => {
            if (err) {
              console.error('Error getting table data:', err);
              reject(err);
            } else {
              console.log("Typeof" , typeof(data.Items));
              movieitem.push(...data.Items);
              resolve();
            }
          });
        })
      ));
    
      Promise.all(queries)
        .then(() => {
          console.log("abc value:" , movieitem);
          setSubscribedArtist(movieitem);
          //flag = true;
        })
        .catch(err => {
          console.error('Error executing queries:', err);
        });

      

    }




    useEffect(() => {
        
        fetchDetails();
        //fetchQuery();
      }, []);


    
    
    const handleSubmitbtn = (e) => {
        e.preventDefault();
       
        setRedirection(true);
        
        
    };
    if (redirect) {
        return <Login />;
      }

      


      const handleRemove = (index, e , attribute) => {
        e.preventDefault();


        const params = {

          TableName: 'login',
          Key: {
            email
          },
          UpdateExpression: 'REMOVE subscribedartist[' + index + ']',
          
          ReturnValues: 'ALL_NEW'
        };
        
        

        docClient.update(params, (err, data) => {


          if (err) {
            console.error('Error updating item:', err);
          } else {
            console.log('Item updated successfully:', data);
            // setSubscribedArtist(data.Attributes.subscribedartist)

            let images = subscribedArtist.filter((item) => {
                return !(item.title === attribute.title && item.year === attribute.year)
            }) 

            setSubscribedArtist(images)
            
          

          
            
          }
        });
      };

     


      {/*Query area backend */}
    let queriedata = [];
    const fetchQuery = (title, year, artist) => {
      
      console.log("This is working")
      const params = (title, year, artist) => ({
        TableName: "music",
        //KeyConditionExpression: "#t = :title AND #yr= :year",
        FilterExpression: '#t = :title OR #yr = :year OR #ar = :artist',
        ExpressionAttributeNames: {
          "#t" : "title",
          "#yr" : "year",
          "#ar" : "artist",
          "#img" : 'img_url'
        },
        ExpressionAttributeValues: {
          ":title": title,
          ":year": year,
          ":artist" : artist,
        },
        ProjectionExpression: '#t, #yr, #ar , #img',
      });

     
       
        docClient.scan(params(title, year, artist), (err, data) => {
          if (err) {
            console.error('Error getting table data:', err);
          } else {
            queriedata.push(...data.Items);
            //console.log("Data.items is as follows:" , data.Items);
            //console.log("checking if this is working");
            setQueriedArtist(queriedata);
            setFlag(!Boolean(data.Items.length))

          }
        });
     
    }

   
            



    {/*Handle buttons */}
      

      const handleQueryClick = (e) => {
        e.preventDefault();
        
        {/*Code for no result recieved is remianing */}
        {/*Should add the query which is fetching immediately */}



        fetchQuery(title, year , artist)
        
        
      };

      const handleSubscribe = (e , title, year) => {
        e.preventDefault();
        const params = {
          TableName: "login",
          Key: {
            "email": email
          },
          UpdateExpression: "SET #sa = list_append(#sa, :newItems)",
          ExpressionAttributeNames: {
            "#sa": "subscribedartist"
          },
          ExpressionAttributeValues: {
            ":newItems": [
              {
                "title": title,
                "year": year
              }
            ]
          },
          ReturnValues: "UPDATED_NEW"
        };
        
        docClient.update(params, function(err, data) {
          if (err) {
            console.error("Unable to update item", err);
          } else {
            console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          }
        });




      }





    return(
        <form className="main-form" onSubmit={handleSubmitbtn}>
            <div className="main-form">
            <h2>Welcome {user_name}! </h2>

            {/* Subscription area remains */ }
            <h3>Your Subscribed music information is as follows:</h3>

            {console.log("subscribedartist data" , subscribedArtist)}

            {subscribedArtist.map( (item, index ) => (
              <div key = {item.id}>
                <br></br>
                <span><strong>Title:</strong> {item.title} <strong> Artist: </strong> {item.artist}{''} <strong>Year:</strong>{item.year} <img src ={item.img_url} alt="image.png" height="50px" width= "50px" /> &nbsp;</span>
                <button className="remove-btn" onClick={(e) => handleRemove(index, e, item)}>Remove</button>
              </div>
            )

            )}

            {/* Query Area code: */}

            <h2>Search Query</h2>

            <label htmlFor = "title">Title</label>
            <input value={title} type= "title" placeholder="title" id="title" name= "title" onChange={(e) => setTitle(e.target.value)} />

            <label htmlFor = "year">Year</label>
            <input value={year} type= "year" placeholder="year" id="year" name= "year" onChange={(e) => setYear(e.target.value)} />

            <label htmlFor = "artist">Artist</label>
            <input value={artist} type= "artist" placeholder="artist" id="artist" name= "artist" onChange={(e) => setArtist(e.target.value)} />

            <button className="query_btn"  onClick={handleQueryClick}>Query</button>

            {/* HTML code for query area to display */}
              <h2>The queried data is as follows:</h2>

              <div>
              {flag ? <div><h1>No result is retrieved. Please query
again</h1></div> : queriedArtist.map( (item, index ) => (
              <div key = {item.id}>
                <br></br>
                <span><strong>Title:</strong> {item.title} <strong> Artist: </strong> {item.artist}{''} <strong>Year:</strong>{item.year} <img src ={item.img_url} alt="image.png" height="50px" width= "50px" /> &nbsp;</span>
                <button className="subscribe-btn" onClick={(e) => handleSubscribe(e, item.title, item.year)}>Subscribe</button>
                
              
              
              
              </div>
            )

            )} 


              </div>




              <br></br>

            <button type="submit" >Logout</button>
        </div>
        </form>
        
    )       
  }