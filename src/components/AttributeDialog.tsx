import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";

type Props = {
  artifact: any;
  onAttribute: () => Promise<void>;
  loading: boolean;
};

const AttributeDialog = ({ artifact, onAttribute, loading }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={loading}>
          {" "}
          {loading ? (
            <>
              <Loader2Icon className="animate-spin w-4 h-4" />
              Attributing...
            </>
          ) : (
            "Check Referenced Artifact"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attribute Artifact</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full h-[350px] lg:w-72 lg:h-72 rounded-lg border-2">
            <Image
              src={artifact.imageUrl}
              alt={artifact.name}
              fill={true}
              className="object-cover rounded-lg"
            />
          </div>
          <p>
            <strong>Artifact Name:</strong> {artifact.name} <br />
            <strong>License:</strong> {artifact.license} <br />
            <strong>Creator ID:</strong> {artifact.creatorId} <br />
          </p>
        </div>
        <DialogFooter className="">
          <DialogClose asChild>
            <Button type="button" className="w-full" onClick={onAttribute}>
              Make Attribution
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttributeDialog;
