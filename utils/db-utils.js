export const POSTS_PREFETCH_LIMIT = 5;
import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../lib/mongodb";

export const getAppProps = async (ctx) => {
  const {params, req, res} = ctx;
  const userSession = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('njsblogsaas');

  const user = await db.collection('users').findOne({
    auth0Id: userSession.user.sub
  });

  if(!user) {
    return {
      tokens: 0,
      posts: []
    };
  }

  const posts = await db.collection('posts').find({
    userId: user._id
  })
  .sort({
    created: -1
  }).limit(POSTS_PREFETCH_LIMIT)
  .toArray();

  return {
    tokens: user.availableTokens,
    posts: posts.map(
      ({created, _id, userId, ...rest}) => ({
        _id: _id.toString(),
        created: created.toString(),
        ...rest
      }))
  }
}