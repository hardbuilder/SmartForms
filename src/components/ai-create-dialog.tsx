
"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { DialogProps } from "@radix-ui/react-dialog";
import { getOptimizedForm } from "@/app/actions";
import type { FormState } from "@/app/create/page";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

type AiCreateDialogProps = DialogProps & {
    onFormGenerated: (formState: FormState) => void;
};

export function AiCreateDialog({ onFormGenerated, ...props }: AiCreateDialogProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await getOptimizedForm(prompt);
      if (result.success && result.data) {
        onFormGenerated(result.data);
        if (props.onOpenChange) {
            props.onOpenChange(false);
        }
      } else {
        setError(result.error || "An unknown error occurred.");
      }
    } catch (e: any) {
        setError(e.message || "An unexpected error occurred.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create with AI</DialogTitle>
          <DialogDescription>
            Describe the form you want to create. Be as specific as you can!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
            <Textarea 
                placeholder="e.g., A customer satisfaction survey with questions about product quality, customer support, and a rating for overall experience."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                disabled={isLoading}
            />
            {error && (
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
        <DialogFooter>
            <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Form
                    </>
                )}
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
