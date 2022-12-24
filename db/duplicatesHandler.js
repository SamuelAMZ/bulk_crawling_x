const { MongoClient } = require("mongodb");
require("dotenv").config();

/*
 * duplicate check and removal
 */

const agg = [
  {
    $group: {
      _id: {
        profileLink: "$profileLink",
      },
      dups: {
        $addToSet: "$_id",
      },
      count: {
        $sum: 1,
      },
    },
  },
  {
    $match: {
      count: {
        $gt: 1,
      },
    },
  },
];

(async () => {
  const client = await MongoClient.connect(process.env.DBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const coll = client.db("app").collection("independants");
  const cursor = coll.aggregate(agg);
  const result = await cursor.toArray();

  console.log(result);

  await result.forEach(function (doc) {
    doc.dups.shift();
    coll.deleteOne({
      _id: { $in: doc.dups },
    });
  });
  //   await client.close();
})();
