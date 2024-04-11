// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIApi, Configuration } from "openai"
export default async function handler(req, res) {

  if(req.method === 'POST') {

    const {
      topic,
      keywords
    } = req.body;

    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    })
  
    const openai = new OpenAIApi(config);
  
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO freindly blog post generator called "(The)Common Nonsense"  You are designed to output markdown without formmatter'
        }, {
          role: 'user',
          content: `
            Generate me a long and detailed SEO freindly blog post of the following topic delimited by triple hyphens:
            ---
            ${topic}
            ---
            Targeting the following comma separated keywords delimited by triple hyphens:
            ---
            ${keywords}
            ---
          `
        },
      ],
    });
  
    const postcontent = response.data.choices[0]?.message?.content;
  
    const responseSeo = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO freindly blog post generator called "(The)Common Nonsense". You are designed to output JSON. Do not include HTML tags in your output or anything not UTF-8 safe.'
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
  
    res.status(200).json({ 
      post: {
        postcontent: response.data.choices[0]?.message?.content,
        posttitle: postSeoObj.title,
        metadescription: postSeoObj.metaDescription
      }
     });
  }
}
