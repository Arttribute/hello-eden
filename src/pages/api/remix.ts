import axios from "axios";
import { EdenClient } from "@edenlabs/eden-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { image_input, text_input } = req.body;

  const requestBody = [
    {
      asset: {
        data: image_input, // Base64 string of the image
        mimetype: "image/jpeg", // Adjust the mimetype as needed
        name: "referenceImage.jpg", // Adjust the name as needed
      },
      name: "Reference Image",
      license: "Open", // Adjust the license as needed
      whitelist: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"], // Adjust as needed
      blacklist: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"], // Adjust as needed
    },
  ];
  try {
    const {
      data: { data: attributionData },
    } = await axios.post(
      "http://localhost:3200/v2/artifacts/check",
      JSON.stringify(requestBody),
      {
        headers: {
          "Content-Type": "application/json",
          "x-authentication-email": "khalifafumo@yahoo.co.uk",
        },
      }
    );

    if (attributionData[0].attribution === false) {
      return res
        .status(401)
        .json({ error: "Fair use checks failed", data: attributionData });
    }

    if (attributionData[0].imageId === null) {
      return res.status(404).json({ error: "This image is not registered" });
    }

    if (attributionData[0].imageId && attributionData[0].attribution) {
      const eden = new EdenClient({
        edenApiUrl: process.env.EDEN_API_URL,
        apiKey: process.env.EDEN_API_KEY,
      });

      const result = await eden.createV2({
        workflow: "remix",
        args: {
          image: "https://khalifafumo.me/me.jpg",
        },
      });
      console.log(result);
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
