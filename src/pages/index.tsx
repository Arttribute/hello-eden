import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import SideDrawer from "@/components/SideDrawer";
import { Separator } from "@/components/ui/separator";
import CreateBox from "@/components/CreateBox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_FILE_SIZE = 5000000;

const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  file: z
    .any()
    .refine((files: FileList) => files?.length > 0, "Please select an image.")
    .refine((files: FileList) => {
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max image size is 5MB.`)
    .refine(
      (files: FileList) => ACCEPTED_IMAGE_MIME_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  prompt: z.string().min(1, "Please enter a prompt."),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      prompt: "",
    },
  });

  const [resultImageUrl, setResultImageUrl] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      if (!values.file) throw new Error("Please select an image.");
      if (values.file[0].size > MAX_FILE_SIZE)
        throw new Error(`Max image size is 5MB.`);

      if (!ACCEPTED_IMAGE_MIME_TYPES.includes(values.file[0].type))
        throw new Error(
          "Only .jpg, .jpeg, .png and .webp formats are supported."
        );

      // const message: string | null = await fetchMessage(web3Address);
      // const signedMessage: string | null = Boolean(minipay)
      //   ? await signMinipayMessage(message)
      //   : await signMessage(web3, web3Address, message);

      // const fileAsBase64 = await fileToBase64(values.file[0]);

      // const res = await fetch("/api/artifacts", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     fileAsBase64,
      //     license: values.license,
      //     authHeaders: {
      //       address: web3Address,
      //       message,
      //       signature: signedMessage,
      //     } as AuthHeaders,
      //   }),
      // });

      const imageTaskResponse = await axios.post("/api/submit", {
        text_input: values.prompt,
      });
      const { taskId } = imageTaskResponse.data;

      let imageUrl = null;

      const pollForImage = async () => {
        const pollResponse = await axios.post("/api/poll", { taskId });
        if (pollResponse.data.uri) {
          imageUrl = pollResponse.data.uri;
          setResultImageUrl(imageUrl);
          setLoading(false);
        } else {
          setTimeout(pollForImage, 4000); // Poll every 4 seconds
        }
      };

      pollForImage();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="h-full w-3/5 md:w-2/5 lg:w-1/6 rounded-none p-6 hidden lg:block">
        <SideDrawer />
      </div>
      <Separator
        orientation="vertical"
        className="min-h-[calc(100vh-4rem)] hidden lg:block w-[0.5px]"
      />
      <div className="h-full w-min rounded-md border m-4 p-6">
        <CreateBox form={form} onSubmit={onSubmit} loading={loading} />
      </div>
      <main className="p-4 flex-1">
        <h1 className="text-2xl font-bold mb-4">
          Hello <span className="text-[#61af7b]">Eden</span>, meet{" "}
          <span className="text-[#f74581]">Arttribute</span>
        </h1>
        {resultImageUrl ? (
          <div className="flex justify-center">
            <Image
              src={resultImageUrl}
              alt={form.getValues("prompt")}
              width={500}
              height={500}
              className="rounded-lg shadow-lg"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center min-h-[200px] border rounded-md">
            <h1 className="text-lg">Nothing to see!</h1>
          </div>
        )}
      </main>
    </div>
  );
}
