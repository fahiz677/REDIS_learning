import express from 'express';
import axios from 'axios';
import cors from 'cors';
import Redis from "redis";
const app = express();

app.use(cors());

const redisClient =  Redis.createClient();

const DEFAULT_EXPRIATION = 3600;

app.get("/photos", async (req, res) => {
    const albumId = req.params.albumId;
    const redisClient = Redis.createClient();
    redisClient.get("photos", async (error, photos) => {
      if (error) {
        console.log(error);
        redisClient.quit();
        return res.status(500).send("Internal server error");
      }
      if (photos != null) {
        redisClient.quit();
        return res.json(JSON.parse(photos));
      } else {
        try {
          const { data } = await axios.get(
            "https://jsonplaceholder.typicode.com/photos",
            {
              params: { albumId },
            }
          );
          redisClient.setex("photos", DEFAULT_EXPRIATION, JSON.stringify(data));
          redisClient.quit();
          return res.json(data);
        } catch (error) {
          console.log(error);
          redisClient.quit();
          return res.status(500).send("Internal server error");
        }
      }
    });
  });
  

app.listen(8000)



/**
 * ! REDIS COMMANDS !!
 * 
 ** REDIS-CLI **
 ** SET NAME FAHIZ ** 
 ** GET NAME  ** 
 *? DEL NAME  **
 *? EXISTS  
 *? KEY *  [GET ALL THE KEY WE HAVE] **
 * !! FLUSHALL [ REMOVE ALL THE KEY WE HAVE] !!
 ** TTL NAME [TIME TO LIVE IT WILL HELP TO SET THE  DATA TIME LIMIT]
 *? EXPIRE NAME 10 {AFTER 10S DELETE THE DATA}
 *
 * 
 * 
 ** SETEX NAME 10 FAHIZ [ COMBINATION OF SET AND EXPIRE]
 * 
 * !! LIST !!
 * 
 *? LPUSH FIRENDS FAHIZ (FOR THE SET INTO A ARRAY LIKE ) 
 * 
 * ? RPUSH FRIENDS FAHIZ (FOR THE SET INTO RIGHT SIDE  ANOTHER ONE TO SET IN THE LEFT SIDE)
 * 
 * ? LRANGE FIRENDS FAHIZ 0 -1(FOR TO GET ALL THE DATAS FORM THE LIST WE HAVE)
 * 
 * ? LPOP FIRENDS (IT WILL REMOVE THE DATE FORM THE TOP)
 * 
 * !! SETS !!
 * 
 * ? SADD HOBBIES " EATHING FOOD " (SET INTO A UNINICE VALUE )
 * ? SMEMBERS HOBBIES  (GET ALL)
 * ? SREM HOBBIES (TO DELETE )
 * 
 * 
 * !! HASHES !!
 * 
 * 
 ** HSET PERSON NAME 'FAHIZ' ()
 ** HGET PERSON NAME 
 ** HGETALL PERSON 
 ** HDEL PERSON NAME
 ** HEXISTS PERSON NAME
 */