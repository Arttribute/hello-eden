import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { Button } from "./ui/button";
import { XIcon, ImageIcon, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<
    {
      prompt: string;
      file?: any;
    },
    any,
    undefined
  >;
  onSubmit: (values: any) => Promise<void>;
  loading: boolean;
};

const CreateBox = ({ form, onSubmit, loading }: Props) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <div className="items-center">
                {field.value ? (
                  <div className="relative w-full h-[350px] lg:w-72 lg:h-72  rounded-lg border-2">
                    <Image
                      src={URL.createObjectURL(field.value[0])}
                      alt="Artifact preview"
                      fill={true}
                      className="object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0.5 right-0.5 w-6 h-6 rounded-full"
                      onClick={() => {
                        form.reset({ file: undefined });
                      }}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="file">
                    <div className="relative bg-gray-50 flex items-center justify-center w-full h-[350px] lg:w-72 lg:h-72 rounded-lg border-2">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  </label>
                )}
                <FormControl className="mt-1.5 w-full lg:w-72">
                  <Input
                    type="file"
                    id="file"
                    onBlur={field.onBlur}
                    name={field.name}
                    onChange={(e) => {
                      field.onChange(e.target.files);
                    }}
                    ref={field.ref}
                  />
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Input placeholder="Enter your prompt" {...field} />
              </FormControl>
              <FormDescription>
                This is the prompt that will be used to generate the image.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full lg:w-72"
          disabled={loading || form.formState.isSubmitting}
        >
          {loading ||
            (form.formState.isSubmitting && (
              <Loader2 className="w-4 h-4" />
            ))}{" "}
          Generate
        </Button>
      </form>
    </Form>
  );
};

export default CreateBox;
