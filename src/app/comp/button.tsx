import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function ActionButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <div className="flex items-center justify-center">
          <div className="h-5 w-5 mr-2">
            {/* Add a spinner or loading animation here */}
          </div>
          executing...
        </div>
      ) : (
        "execute"
      )}
    </Button>
  );
}
