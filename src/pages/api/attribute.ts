import axios from "axios";
import { EdenClient } from "@edenlabs/eden-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { artifactId } = req.body;

  console.log("artifactId", artifactId);

  try {
    const { data } = await axios.post(
      "http://localhost:3200/v2/attributions",
      JSON.stringify({ artifactId: artifactId }),
      {
        headers: {
          "Content-Type": "application/json",
          "x-authentication-email": "khalifafumo@yahoo.co.uk",
        },
      }
    );

    return res.status(201).json(data);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
