import axios from "axios";
import { EdenClient } from "@edenlabs/eden-sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { base64ToFile } from "@/lib/utils";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { image_input, text_input } = req.body;

  const requestBody = [
    {
      asset: {
        data: image_input, // Base64 string of the image
        mimetype: "image/jpeg",
        name: "referenceImage.jpg",
      },
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
      // uploading to cloudinary to get URL
      const imageAsFile = base64ToFile(image_input, "referenceImage.jpg");
      const data = new FormData();
      data.append("file", imageAsFile);
      data.append("upload_preset", "studio-upload");

      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/arttribute/upload",
        data
      );

      const uploadedFile = cloudinaryRes.data;

      // eden remix logic
      const eden = new EdenClient({
        edenApiUrl: process.env.EDEN_API_URL,
        apiKey: process.env.EDEN_API_KEY,
      });

      const result = await eden.createV2({
        workflow: "remix",
        args: {
          image: uploadedFile.secure_url,
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
