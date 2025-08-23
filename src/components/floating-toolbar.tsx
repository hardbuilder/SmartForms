
"use client";

import { Bold, Italic, Image as ImageIcon, Save, Eye, Share2, UploadCloud } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FormElementStyle } from "@/app/create/page";
import type { FormState, Question } from "@/app/create/page";
import { Input } from "./ui/input";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { saveRecentForm } from "@/lib/recent-forms";
import { useRouter } from "next/navigation";
import { ShareDialog } from "./share-dialog";

type FloatingToolbarProps = {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState | null>>;
  selectedElement: string | null;
};

type Font = FormElementStyle['font'];

export function FloatingToolbar({ formState, setFormState, selectedElement }: FloatingToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const getSelectedElement = () => {
    if (!selectedElement || !formState) return null;
    if (selectedElement === 'title') return formState.title;
    if (selectedElement === 'description') return formState.description;
    return formState.questions.find(q => q.id === selectedElement) || null;
  }

  const currentElement = getSelectedElement();
  const currentStyle = currentElement ? currentElement.style : null;

  const updateSelectedElementStyle = (property: keyof FormElementStyle, value: any) => {
    if (!selectedElement) return;

    setFormState(prev => {
        if (!prev) return null;
        
        const updateStyle = (element: { style: FormElementStyle }) => {
            return {
                ...element,
                style: {
                    ...element.style,
                    [property]: value
                }
            };
        };

        if (selectedElement === 'title') {
            return { ...prev, title: updateStyle(prev.title) };
        }
        if (selectedElement === 'description') {
            return { ...prev, description: updateStyle(prev.description) };
        }
        return {
            ...prev,
            questions: prev.questions.map(q => 
                q.id === selectedElement ? updateStyle(q) : q
            )
        };
    });
  };
  
  const toggleBold = () => {
    if (currentStyle) updateSelectedElementStyle('isBold', !currentStyle.isBold);
  }

  const toggleItalic = () => {
    if (currentStyle) updateSelectedElementStyle('isItalic', !currentStyle.isItalic);
  }

  const setFont = (font: Font) => {
    updateSelectedElementStyle('font', font);
  }

  const setFontSize = (size: number) => {
    if (!isNaN(size)) {
      updateSelectedElementStyle('fontSize', size);
    }
  }

  const handleHeaderImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setFormState(prev => prev ? ({ ...prev, headerImageUrl: imageUrl }) : null);
    }
  };
  
  const triggerHeaderImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!formState) return;
    saveRecentForm(formState);
    toast({
      title: "Form Saved!",
      description: "Your form has been saved to your recent forms.",
    });
  };

  const handlePreview = () => {
    if (!formState) return;
    const previewState = { ...formState, settings: { ...formState.settings, published: true } };
    saveRecentForm(previewState);
    
    const previewUrl = `/preview?formId=${formState.id}`;
    window.open(previewUrl, '_blank');
  };

  const handleShare = () => {
    if (!formState) return;
     if (!formState.settings.published) {
      toast({
        title: "Form Not Published",
        description: "Please publish your form before sharing.",
        variant: "destructive",
      });
      return;
    }
    saveRecentForm(formState);
    setIsShareDialogOpen(true);
  };

  const handlePublishToggle = () => {
    if (!formState) return;
    const newPublishedState = !formState.settings.published;
    const updatedFormState = { ...formState, settings: {...formState.settings, published: newPublishedState} };
    
    setFormState(updatedFormState);
    saveRecentForm(updatedFormState);

    toast({
      title: `Form ${newPublishedState ? 'Published' : 'Unpublished'}`,
      description: `Your form is now ${newPublishedState ? 'live and accepting responses' : 'a draft and not accepting responses'}.`,
    });
  };


  return (
    <>
      <ShareDialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen} formId={formState.id} />
      <input type="file" ref={fileInputRef} onChange={handleHeaderImageUpload} className="hidden" accept="image/*" />
      <div className="w-full space-y-4">
          <div className="flex items-center gap-2">
            <Button variant={currentStyle?.isBold ? "secondary" : "outline"} size="icon" title="Bold" onClick={toggleBold} disabled={!currentStyle} className="flex-1">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant={currentStyle?.isItalic ? "secondary" : "outline"} size="icon" title="Italic" onClick={toggleItalic} disabled={!currentStyle} className="flex-1">
              <Italic className="h-4 w-4" />
            </Button>
             <Button variant="outline" size="icon" title="Upload Header Image" onClick={triggerHeaderImageUpload} className="flex-1">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="font-family">Font</Label>
            <Select value={currentStyle?.font} onValueChange={(value: Font) => setFont(value)} disabled={!currentStyle}>
              <SelectTrigger id="font-family">
                <SelectValue placeholder="Select font" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inter">Inter</SelectItem>
                <SelectItem value="arial">Arial</SelectItem>
                <SelectItem value="georgia">Georgia</SelectItem>
                <SelectItem value="times-new-roman">Times New Roman</SelectItem>
                <SelectItem value="roboto">Roboto</SelectItem>
                <SelectItem value="open-sans">Open Sans</SelectItem>
                <SelectItem value="lato">Lato</SelectItem>
                <SelectItem value="montserrat">Montserrat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size (px)</Label>
            <Input
              id="font-size"
              type="number"
              value={currentStyle?.fontSize || ''}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              placeholder="e.g. 16"
              className="w-full"
              disabled={!currentStyle}
            />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2">
            <Button className="w-full" onClick={handlePreview} variant="outline">
                <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button className="w-full" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" /> Save
            </Button>
            <Button className="w-full" onClick={handlePublishToggle} variant={formState.settings.published ? 'destructive' : 'default'}>
                <UploadCloud className="mr-2 h-4 w-4" /> {formState.settings.published ? 'Unpublish' : 'Publish'}
            </Button>
          </div>
      </div>
    </>
  );
}
