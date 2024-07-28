import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { imageAsBase64 } = req.body;

  try {
    const { data } = await axios.post(
      "http://localhost:3200/v2/artifacts",
      JSON.stringify({
        asset: {
          data: imageAsBase64,
        },
        license: "Open",
        name: "My Artifact",
      }),
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
