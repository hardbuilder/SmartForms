
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getRecentForms } from "@/lib/recent-forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { FormState, FormElementStyle, Question } from "@/app/create/page";
import { Star, Heart, ThumbsUp, FileUp, AlertTriangle } from "lucide-react";
import Header from "@/components/header";
import type { RatingIcon } from "@/components/form-builder";
import { Progress } from "@/components/ui/progress";

function PreviewPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formId = searchParams.get("formId");
  const [formState, setFormState] = useState<FormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formId) {
      const recentForms = getRecentForms();
      const form = recentForms.find((f) => f.id === formId);
      if (form) {
        setFormState(form);
      }
    }
    setIsLoading(false);
  }, [formId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    setSubmitted(true);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading form preview...</p>
      </div>
    );
  }

  if (!formState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Form not found or could not be loaded.</p>
      </div>
    );
  }

  if (!formState.settings.published) {
    return (
      <>
        <Header showDashboardButton={false} />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center p-4">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Form Not Available</h1>
            <p className="text-muted-foreground mb-4">This form is not currently accepting responses.</p>
            <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
        </div>
      </>
    );
  }

  const getStyleProps = (style: FormElementStyle) => {
    return {
      className: cn({
        'font-bold': style.isBold,
        'italic': style.isItalic,
        'font-inter': style.font === 'inter',
        'font-arial': style.font === 'arial',
        'font-georgia': style.font === 'georgia',
        'font-times-new-roman': style.font === 'times-new-roman',
        'font-roboto': style.font === 'roboto',
        'font-open-sans': style.font === 'open-sans',
        'font-lato': style.font === 'lato',
        'font-montserrat': style.font === 'montserrat',
      }),
      style: {
        fontSize: `${style.fontSize}px`,
      }
    };
  };

  const RatingDisplayIcon = ({ icon, ...props }: { icon: RatingIcon } & React.ComponentProps<typeof Star>) => {
    switch (icon) {
      case 'heart':
        return <Heart {...props} />;
      case 'thumbs-up':
        return <ThumbsUp {...props} />;
      case 'star':
      default:
        return <Star {...props} />;
    }
  };

  const renderQuestion = (question: Question, qIndex: number) => {
    return (
        <Card key={question.id} className="bg-background/50 mb-6">
            <CardHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex items-start gap-4">
                       <span className="text-primary font-semibold mt-2">{qIndex + 1}</span>
                       <div className="flex-1">
                            {question.imageUrl && 
                                <img src={question.imageUrl} alt="Question image" className="h-auto w-full max-h-64 object-cover rounded-md mb-2" data-ai-hint="question image" />
                            }
                           <label {...getStyleProps(question.style)}>{question.text}</label>
                       </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {renderAnswerInput(question)}
            </CardContent>
        </Card>
    );
  };
  
  const renderAnswerInput = (question: Question) => {
    switch (question.type) {
        case "short-answer":
            return <Input placeholder="Your answer" />;
        case "paragraph":
            return <Textarea placeholder="Your answer" />;
        case "radio-group":
            return (
                <RadioGroup>
                    <div className="space-y-2">
                        {(question.options || []).map((opt) => (
                        <div key={opt.id} className="flex items-center gap-3">
                            <RadioGroupItem value={opt.id} id={opt.id} />
                            {opt.imageUrl && <img src={opt.imageUrl} alt="Option" className="h-10 w-10 object-cover rounded-md" data-ai-hint="option image"/>}
                            <Label htmlFor={opt.id}>{opt.value}</Label>
                        </div>
                        ))}
                    </div>
                </RadioGroup>
            );
        case "checkboxes":
            return (
                <div className="space-y-2">
                    {(question.options || []).map((opt) => (
                    <div key={opt.id} className="flex items-center gap-3">
                        <Checkbox id={opt.id} />
                        {opt.imageUrl && <img src={opt.imageUrl} alt="Option" className="h-10 w-10 object-cover rounded-md" data-ai-hint="option image"/>}
                        <Label htmlFor={opt.id}>{opt.value}</Label>
                    </div>
                    ))}
                </div>
            );
        case "dropdown":
            return (
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                        {(question.options || []).filter(opt => opt.value).map((opt) => (
                            <SelectItem key={opt.id} value={opt.value}>
                                <div className="flex items-center gap-2">
                                  {opt.imageUrl && <img src={opt.imageUrl} alt="Option" className="h-6 w-6 object-cover rounded-sm" data-ai-hint="option image"/>}
                                  {opt.value}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case "address":
            return (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street-address">Street Address</Label>
                  <Input id="street-address" placeholder="123 Main St" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street-address-2">Street Address Line 2</Label>
                  <Input id="street-address-2" placeholder="Apartment, suite, etc. (optional)" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Anytown" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" placeholder="CA" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal / Zip Code</Label>
                  <Input id="zip" placeholder="12345" />
                </div>
              </div>
            );
        case "file-upload":
            return (
                <div className="flex items-center justify-center w-full">
                    <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FileUp className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>
            );
        case "rating":
            const { scale = 5, icon = "star" } = question.ratingConfig || {};
            return (
                <div className="flex flex-wrap items-center gap-2">
                    {Array.from({ length: scale }, (_, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group">
                             <RatingDisplayIcon icon={icon} className="w-8 h-8 text-gray-300 group-hover:text-yellow-400 transition-colors" />
                            <span className="text-xs text-muted-foreground">{i + 1}</span>
                        </div>
                    ))}
                </div>
            );
        case "date":
            return <Input type="date" />;
        case "time":
            return <Input type="time" />;
        default:
            return null;
    }
  }

  if (submitted) {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <Header showDashboardButton={false} />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle {...getStyleProps(formState.title.style)}>
                                {formState.title.text}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="mb-4">{formState.settings.confirmationMessage}</p>
                            {formState.settings.showLinkToSubmitAnotherResponse && (
                                <Button variant="link" onClick={() => setSubmitted(false)}>
                                    Submit another response
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header showDashboardButton={false} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    {formState.headerImageUrl && (
                        <img src={formState.headerImageUrl} alt="Form header" className="h-auto w-full max-h-96 object-cover rounded-t-lg mb-4" data-ai-hint="header image" />
                    )}
                    <CardTitle {...getStyleProps(formState.title.style)}>
                        {formState.title.text}
                    </CardTitle>
                    <CardDescription {...getStyleProps(formState.description.style)}>
                        {formState.description.text}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {formState.questions.map((q, index) => renderQuestion(q, index))}
                        <Button type="submit" className="w-full mt-6">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading form preview...</p>
      </div>
    }>
      <PreviewPageContent />
    </Suspense>
  );
}
