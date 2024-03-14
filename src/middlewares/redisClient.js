const redis = require("redis");


let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();


async function getRedisCacheData(req, res, next) {
    const fooditem = req.params.fooditem;
    let results;
    try {
      const cacheResults = await redisClient.get(fooditem);
      if (cacheResults) {
        results = JSON.parse(cacheResults);
        res.send({
          fromCache: true,
          data: results,
        });
      } else {
        next();
      }
    } catch (error) {
      console.error(error);
      res.status(404);
    }
  }


async function updateRedisRecors(redisCatchName) {
    await redisClient.set(redisCatchName, JSON.stringify(results), {
        EX: 180,
        NX: true,
      });
    return
}

exports.module = {
...getRedisCacheData,
...updateRedisRecors
}