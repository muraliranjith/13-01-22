const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();


const insertRedisRecord = async (tableName, payload) => {
  await redisClient.set(tableName, JSON.stringify(payload));
  return;
};
const deleteRedisRecord = async (tableName, payload, id) => {
  const indexToRemove = payload.findIndex((item) => item.id === id);
  if (indexToRemove !== -1) {
    // Remove the record from the array
    payload.splice(indexToRemove, 1);
    await insertRedisRecord(tableName, payload);
  } else {
    console.log("not there record");
  }
};
const updateRedisRecord = async (tableName, payload, id) => {
      // Update the record from the array
      const getAllRecord = await getAllrecordFromRedis(tableName);
      console.log('getAllRecord', getAllRecord);
      const indexToUpdate = getAllRecord.findIndex((item) => item.id === id);
      console.log('getAllRecord', getAllRecord);
      getAllRecord[indexToUpdate] = payload;
      // await insertRedisRecord(tableName, payload);
  };
const getAllrecordFromRedis = async (tableName) => {
  const products = await redisClient.get(tableName);
  let result;
  if (products) {
    result = JSON.parse(products);
  }
  return result;
};
const getOneRecordFromRedisCatch = async (tableName, id) => {
  // Retrieve the record from Redis
  const getProduct = await getAllrecordFromRedis(tableName);
  const desiredObject = getProduct.find((item) => item.id === parseInt(id));

  if (desiredObject) {
    console.log("Found object:", desiredObject);
    return desiredObject;
    // Do something with the desired object
  } else {
    console.log("Object with id", id, "not found");
    // Handle case where object is not found
    return null;
  }
};


module.exports = {
    insertRedisRecord,
    getAllrecordFromRedis,
    getOneRecordFromRedisCatch,
    updateRedisRecord,
    deleteRedisRecord,
}