import { EdenClient } from "@edenlabs/eden-sdk";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { taskId } = req.body;

  try {
    const eden = new EdenClient({
      edenApiUrl: process.env.EDEN_API_URL,
      apiKey: process.env.EDEN_API_KEY,
    });

    const { task } = await eden.tasks.get({ taskId });

    if (!task) {
      throw new Error("Task not found");
    }

    const { status, creation } = task;

    if (status === "completed") {
      res.status(200).json({ uri: creation.uri });
    }

    if (status === "failed") {
      res.status(500).json({ error: "Task failed" });
    }

    res.status(200).json({ uri: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default handler;
