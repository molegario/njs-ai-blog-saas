import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { POSTS_PREFETCH_LIMIT } from "../../utils/db-utils";

export default withApiAuthRequired(
  async function handler(req, res) {

    if(req.method === 'POST') {
      try{
        const {user} = await getSession(req, res);
        const client = await clientPromise;
        const db = client.db('njsblogsaas');
        const userProfile = await db.collection('users').findOne({
          auth0Id: user.sub
        });
        const { lastCreatedDate, isRefresh } = req.body;

        const posts = await db.collection('posts').find({
          userId: userProfile._id,
          created: {
            [isRefresh ? "$gt" : "$lt"]: new Date(lastCreatedDate)
          }
        }).sort({
          created: -1,
        }).limit(isRefresh ? 0 : POSTS_PREFETCH_LIMIT)
        .toArray();
  
        res.status(200).json({ posts });
        return;
      } catch(e) {
        res.status(500).json({
          message: e.message ?? 'failed to get a blog listing'
        });
        return;
      }
    }
    res.status(200).json({ name: 'no action was requested' });
  }
);