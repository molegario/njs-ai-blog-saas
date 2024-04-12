import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default withApiAuthRequired(
  async function handler(req, res) {
    if(req.method==="POST") {
      try{
        const {user} = await getSession(req, res);
        const client = await clientPromise;
        const db = client.db('njsblogsaas');
        const userProfile = await db.collection('users').findOne({
          auth0Id: user.sub
        });
        const { postid } = req.body;
  
        await db.collection('posts').deleteOne(
          {
            _id: new ObjectId(postid),
            userId: userProfile._id,
          }
        );
        
        res.status(200).json({success:true});
        
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