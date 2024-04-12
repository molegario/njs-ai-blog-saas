// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { OpenAIApi, Configuration } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired (async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('njsblogsaas');

  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub
  });

  //no token -> no create
  if(!userProfile?.availableTokens) {
    console.log("NO TOKEN!!", userProfile);
    res.status(403);
    return;
  }

  //generate post
  if(req.method === 'POST') {

    const {
      topic,
      keywords
    } = req.body;

    if(!topic || !keywords) {
      res.status(422);
      return;
    }

    if(topic.length > 150 || keywords.length > 150) {
      res.status(422);
      return;
    }

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })
  
    const openai = new OpenAIApi(config);
  
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO freindly blog post generator called "(The)Common Nonsense".  You are designed to output markdown without formmatter'
        }, {
          role: 'user',
          content: `
            Generate a blog post ready for publishing on the following topic delimited by triple hyphens:
            ---
            ${topic}
            ---
            Your output should incorporate for SEO optimization the following provided list of keywords delimited by triple hyphens:
            ---
            ${keywords}
            ---
            The blog post should include proper headings, subheadings, and any necessary lists or bullet points for clarity. 
            Aim for a comprehensive and informative piece that will captivate readers and enhance search engine visibility.
          `
        },
      ],
    });
  
    const postcontent = response.data.choices[0]?.message?.content;
  
    //generate title and metadata
    const responseSeo = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO freindly blog post generator called "(The)Common Nonsense". You are designed to output JSON. Do not include HTML tags in your output or anything not UTF-8 safe. Do not include in your output your own commentary on the task, the list of the keywords, or the topic given.'
        },
        {
          role: 'user',
          content: `
            Generate an SEO friendly title and SEO friendly meta description for the following blog post delimited by triple hyphens:
            ---
            ${postcontent}
            ---
            the output must be in the following format:
            {
              "title": "example title",
              "metaDescription": "example meta description"
            }
          `
        }
      ],
      response_format: {
        type: "json_object"
      },
    });
  
    const postSeoContent = responseSeo.data.choices[0]?.message?.content ?? {};
    const postSeoObj = JSON.parse(postSeoContent);

    //decrement token for creation
    await db.collection('users').updateOne({
      auth0Id: user.sub
    }, {
      $inc: {
        availableTokens: -1
      }
    });

    //insert user stamped post
    const post = await db.collection('posts').insertOne({
      postcontent: response.data.choices[0]?.message?.content,
      posttitle: postSeoObj.title,
      metadescription: postSeoObj.metaDescription,
      topic,
      keywords,
      userId: userProfile._id,
      created: new Date(),
    })

    //send saved post with new _id
    res.status(200).json({ 
      postid: post.insertedId,
    });
    return;
  }

  res.status(200).json({ name: 'no action was requested' });
});
