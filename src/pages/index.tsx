import Image from "next/image";
import { useState } from "react";
import axios from "axios";
import SideDrawer from "@/components/SideDrawer";
import { Separator } from "@/components/ui/separator";
import CreateBox from "@/components/CreateBox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { fileToBase64 } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

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
  // prompt: z.string().min(1, "Please enter a prompt."),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
      // prompt: "",
    },
  });

  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any | null>(null);
  const [artifactId, setArtifactId] = useState<string | null>(null);
  const [hasAttribution, setHasAttribution] = useState(false);
  const [hasRegistration, setHasRegistration] = useState<boolean | null>(null);
  const [isLoadingRegistration, setIsLoadingRegistration] = useState(false);
  const [isLoadingAttribution, setIsLoadingAttribution] = useState(false);

  const registerImage = async () => {
    setLoading(true);
    setIsLoadingRegistration(true);
    try {
      const imageAsBase64 = await fileToBase64(form.getValues("file")[0]);
      const registerRes = await axios
        .post("/api/register", {
          imageAsBase64,
        })
        .catch((error) => {
          throw error;
        });

      console.log(registerRes.data);
      setHasRegistration(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.toString());
    } finally {
      setLoading(false);
      setIsLoadingRegistration(false);
    }
  };

  const makeAttribution = async () => {
    setLoading(true);
    setIsLoadingAttribution(true);
    try {
      const attributionRes = await axios
        .post("/api/attribute", {
          artifactId: artifactId,
        })
        .catch((error) => {
          throw error;
        });

      console.log(attributionRes.data);
      setHasAttribution(true);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.toString());
    } finally {
      setLoading(false);
      setIsLoadingAttribution(false);
    }
  };

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

      const imageAsBase64 = await fileToBase64(values.file[0]);

      const imageRes = await axios
        .post("/api/remix", {
          // text_input: values.prompt,
          image_input: imageAsBase64,
        })
        .catch((error) => {
          console.error(error);
          const artifactId = error.response.data.data
            ? error.response.data.data[0].imageId
            : null;
          if (artifactId) {
            setArtifactId(artifactId);
            throw new Error(`${error.response.data.error}: ID: ${artifactId}`);
          }
          if (error.response.data.error === "This image is not registered") {
            setHasRegistration(false);
          }
          throw new Error(`${error.response.data.error}`);
        });

      const images = imageRes.data;
      console.log(images);
      setResultImageUrl(images[0].url);
    } catch (error: any) {
      const errStr = error.toString();
      setErrorMsg(errStr);
    } finally {
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
              // alt={form.getValues("prompt")}
              alt="Artifact"
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
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {artifactId && (
          <Button onClick={makeAttribution} disabled={loading}>
            {isLoadingAttribution ? (
              <>
                <Loader2Icon className="animate-spin w-4 h-4" />
                Attributing...
              </>
            ) : (
              "Make Attribution"
            )}
          </Button>
        )}
        {hasRegistration === false && (
          <div>
            <p>This image is not registered. Please register it first.</p>
            <Button onClick={registerImage} disabled={loading}>
              {isLoadingRegistration ? (
                <>
                  <Loader2Icon className="animate-spin w-4 h-4" />
                  Registering...
                </>
              ) : (
                "Register Image"
              )}
            </Button>
          </div>
        )}
        {hasAttribution && <p>Attribution successful!</p>}
        {hasRegistration === true && <p>Registration successful!</p>}
      </main>
    </div>
  );
}
