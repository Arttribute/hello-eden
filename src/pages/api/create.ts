import { EdenClient } from "@edenlabs/eden-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { text_input } = req.body;

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.EDEN_API_URL,
      apiKey: process.env.EDEN_API_KEY,
    });
    const uris = await eden.create({
      generatorName: "create",
      config: {
        text_input,
      },
    });
    return res.status(200).json({ uri: uris[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
