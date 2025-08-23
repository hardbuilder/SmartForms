
"use client";

import FormBuilder from "@/components/form-builder";
import Header from "@/components/header";
import { FloatingToolbar } from "@/components/floating-toolbar";
import { useState, useEffect, Suspense } from "react";
// Import Question type from form-builder
import type { Question } from "@/components/form-builder";

// Re-export for other components
export type { Question } from "@/components/form-builder";
import { useSearchParams } from 'next/navigation';
import { getTemplate } from "@/lib/template-data";
import { getRecentForms, saveRecentForm } from "@/lib/recent-forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListChecks, LineChart, Settings, BarChartBig, Wrench, ShieldCheck, FileText, UserSquare, HelpCircle, ChevronLeft, ChevronRight, Star, Heart, ThumbsUp, FileUp, Trash2, FileDown, MoreVertical, Link2Off, Printer, Mail, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { RatingIcon } from "@/components/form-builder";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import * as XLSX from 'xlsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PlagiarismReports from "@/components/plagiarism-reports";

export type Option = { id: string; value: string };
export type QuestionType =
  | "short-answer"
  | "paragraph"
  | "radio-group"
  | "checkboxes"
  | "dropdown"
  | "file-upload"
  | "rating"
  | "date"
  | "time"
  | "address";

export type FormElementStyle = {
  font: "inter" | "arial" | "georgia" | "times-new-roman" | "roboto" | "open-sans" | "lato" | "montserrat";
  fontSize: number;
  isBold: boolean;
  isItalic: boolean;
};

export type FormSettings = {
    isQuiz: boolean;
    collectEmail: "do-not-collect" | "verified-only" | "unverified-only";
    sendCopyOfResponse: "off" | "when-requested" | "always";
    allowResponseEditing: boolean;
    limitToOneResponse: boolean;
    shuffleQuestionOrder: boolean;
    confirmationMessage: string;
    showLinkToSubmitAnotherResponse: boolean;
    viewResultsSummary: boolean;
    disableAutoSave: boolean;
    makeQuestionsRequiredByDefault: boolean;
    published: boolean;
};


export type FormState = {
  id: string;
  title: { text: string; style: FormElementStyle };
  description: { text: string; style: FormElementStyle };
  questions: Question[];
  headerImageUrl?: string;
  settings: FormSettings;
};

type IndividualResponse = {
  id: string;
  submittedAt: Date;
  responder: string;
  answers: Record<string, any>;
};


const defaultStyle: FormElementStyle = {
  font: "inter",
  fontSize: 16,
  isBold: false,
  isItalic: false,
};

function generateRealisticResponses(formState: FormState): IndividualResponse[] {
  const responses: IndividualResponse[] = [];
  
  // Sample responses with realistic plagiarism scenarios
  const sampleTexts = {
    paragraph: [
      "Renewable energy sources are crucial in today's world as they provide sustainable alternatives to fossil fuels. Solar power, wind energy, and hydroelectric systems offer clean energy solutions that reduce greenhouse gas emissions and combat climate change. These technologies have become increasingly affordable and efficient, making them viable options for both residential and commercial applications.",
      "In modern society, renewable energy sources play a vital role in addressing environmental concerns and energy security. Solar power, wind energy, and hydroelectric systems represent sustainable alternatives to traditional fossil fuels. These clean energy technologies help reduce carbon emissions while providing long-term economic benefits through reduced energy costs.",
      "Renewable energy is essential for sustainable development in the 21st century. Wind, solar, and hydroelectric power sources offer environmentally friendly alternatives to coal and oil. The importance of these renewable sources lies in their ability to generate electricity without depleting natural resources or contributing significantly to air pollution.",
      "The significance of renewable energy in contemporary society cannot be overstated. These sustainable power sources, including solar panels, wind turbines, and hydroelectric dams, provide clean electricity while minimizing environmental impact. As technology advances, renewable energy becomes more cost-effective and accessible to communities worldwide.",
      "Renewable energy sources are crucial in today's world as they provide sustainable alternatives to fossil fuels. Solar power, wind energy, and hydroelectric systems offer clean energy solutions that reduce greenhouse gas emissions and combat climate change." // Partial copy of first response
    ],
    shortAnswer: [
      "Clean energy, reduced emissions, cost savings, job creation, and energy independence.",
      "Environmental protection, economic benefits, sustainable development, and energy security.",
      "Lower carbon footprint, renewable resources, technological innovation, and long-term sustainability.",
      "Reduced pollution, infinite supply, decreasing costs, and enhanced grid stability.",
      "Clean energy, reduced emissions, cost savings, job creation, and energy independence." // Exact copy
    ]
  };
  
  // Generate responses for each question
  const responseData = [
    { id: 'r1', email: 'student1@university.edu', time: new Date(Date.now() - 3600000) },
    { id: 'r2', email: 'student2@university.edu', time: new Date(Date.now() - 7200000) },
    { id: 'r3', email: 'student3@university.edu', time: new Date(Date.now() - 10800000) },
    { id: 'r4', email: 'student4@university.edu', time: new Date(Date.now() - 14400000) },
    { id: 'r5', email: 'student5@university.edu', time: new Date(Date.now() - 18000000) },
  ];
  
  responseData.forEach((responder, index) => {
    const answers: Record<string, any> = {};
    
    formState.questions.forEach((question) => {
      switch (question.type) {
        case 'paragraph':
          answers[question.id] = sampleTexts.paragraph[index] || sampleTexts.paragraph[0];
          break;
        case 'short-answer':
          answers[question.id] = sampleTexts.shortAnswer[index] || sampleTexts.shortAnswer[0];
          break;
        case 'radio-group':
        case 'dropdown':
          if (question.options && question.options.length > 0) {
            answers[question.id] = question.options[Math.floor(Math.random() * question.options.length)].id;
          }
          break;
        case 'checkboxes':
          if (question.options && question.options.length > 0) {
            const numSelected = Math.floor(Math.random() * 3) + 1;
            answers[question.id] = question.options
              .slice(0, numSelected)
              .map(opt => opt.id);
          }
          break;
        case 'rating':
          const scale = question.ratingConfig?.scale || 5;
          answers[question.id] = Math.floor(Math.random() * scale) + 1;
          break;
        case 'date':
          answers[question.id] = new Date().toISOString().split('T')[0];
          break;
        case 'time':
          answers[question.id] = '14:30';
          break;
        case 'address':
          answers[question.id] = {
            street1: '123 Main St',
            street2: '',
            city: 'Anytown',
            state: 'NY',
            zip: '12345'
          };
          break;
        default:
          answers[question.id] = `Sample answer ${index + 1}`;
      }
    });
    
    responses.push({
      id: responder.id,
      submittedAt: responder.time,
      responder: responder.email,
      answers
    });
  });
  
  return responses;
}

  const defaultFormState: FormState = {
  id: `form-${new Date().getTime()}`,
  title: { text: "Course Assignment: Essay Questions", style: { ...defaultStyle, fontSize: 24, isBold: true } },
  description: { text: "Please answer the following essay questions thoroughly.", style: defaultStyle },
  questions: [
    {
      id: "1",
      text: "Explain the importance of renewable energy sources in modern society.",
      style: defaultStyle,
      type: "paragraph",
    },
    {
      id: "2",
      text: "What are the key benefits of renewable energy?",
      style: defaultStyle,
      type: "short-answer",
    },
  ],
  settings: {
    isQuiz: false,
    collectEmail: "do-not-collect",
    sendCopyOfResponse: "off",
    allowResponseEditing: false,
    limitToOneResponse: false,
    shuffleQuestionOrder: false,
    confirmationMessage: "Thank You for your response",
    showLinkToSubmitAnotherResponse: true,
    viewResultsSummary: false,
    disableAutoSave: false,
    makeQuestionsRequiredByDefault: false,
    published: false,
  },
};

const ResponseRenderer = ({ question, answer }: { question: Question, answer: any }) => {
    const getStyleProps = (style: FormElementStyle) => ({
      className: cn({
        'font-bold': style.isBold, 'italic': style.isItalic,
        'font-inter': style.font === 'inter', 'font-arial': style.font === 'arial', 'font-georgia': style.font === 'georgia', 'font-times-new-roman': style.font === 'times-new-roman', 'font-roboto': style.font === 'roboto', 'font-open-sans': style.font === 'open-sans', 'font-lato': style.font === 'lato', 'font-montserrat': style.font === 'montserrat',
      }),
      style: { fontSize: `${style.fontSize}px` }
    });

    const RatingDisplayIcon = ({ icon, ...props }: { icon: RatingIcon } & React.ComponentProps<typeof Star>) => {
      switch (icon) {
        case 'heart': return <Heart {...props} />;
        case 'thumbs-up': return <ThumbsUp {...props} />;
        case 'star': default: return <Star {...props} />;
      }
    };

    const renderAnswer = () => {
        if (!answer) return <p className="text-muted-foreground italic">No response</p>;

        switch(question.type) {
            case 'short-answer':
            case 'paragraph':
            case 'date':
            case 'time':
                return <p className="p-2 border rounded-md bg-muted/50">{answer}</p>;
            case 'radio-group':
            case 'dropdown':
                 return <p className="p-2 border rounded-md bg-muted/50">{question.options?.find(o => o.id === answer)?.value || answer}</p>;
            case 'checkboxes':
                const selectedOptions = question.options?.filter(o => answer.includes(o.id)).map(o => o.value).join(', ');
                return <p className="p-2 border rounded-md bg-muted/50">{selectedOptions || 'No option selected'}</p>;
            case 'rating':
                const { scale = 5, icon = "star" } = question.ratingConfig || {};
                return (
                    <div className="flex items-center gap-2">
                        {Array.from({ length: scale }, (_, i) => (
                            <RatingDisplayIcon key={i} icon={icon} className={cn("w-6 h-6", i < answer ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                        ))}
                        <span className="font-medium">({answer}/{scale})</span>
                    </div>
                );
            case 'address':
                 return (
                    <div className="p-2 border rounded-md bg-muted/50 space-y-1">
                        <p>{answer.street1}</p>
                        {answer.street2 && <p>{answer.street2}</p>}
                        <p>{answer.city}, {answer.state} {answer.zip}</p>
                    </div>
                 );
            case 'file-upload':
                 return <a href={answer} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{answer.split('/').pop()}</a>
            default:
                return <p>{String(answer)}</p>;
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle {...getStyleProps(question.style)}>{question.text}</CardTitle>
            </CardHeader>
            <CardContent>
                {renderAnswer()}
            </CardContent>
        </Card>
    );
};

function CreateFormPageContent() {
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();
  
  const [formState, setFormState] = useState<FormState | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<IndividualResponse[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);


  useEffect(() => {
    const templateId = searchParams.get('template');
    const recentFormId = searchParams.get('recent');

    let loadedForm: FormState | null = null;

    if (recentFormId) {
        const recentForms = getRecentForms();
        const form = recentForms.find(f => f.id === recentFormId);
        if (form) {
          loadedForm = form;
        }
    } else if (templateId) {
      const template = getTemplate(templateId);
      if (template) {
        loadedForm = { ...template.formState, id: `form-${new Date().getTime()}` };
      }
    }
    
    if (loadedForm) {
        setFormState(loadedForm);
        // Generate realistic responses with plagiarism-detectable content
        const placeholderResponses: IndividualResponse[] = generateRealisticResponses(loadedForm);
        setResponses(placeholderResponses);
    } else {
        const newForm = { ...defaultFormState, id: `form-${new Date().getTime()}` };
        setFormState(newForm);
        const defaultResponses = generateRealisticResponses(newForm);
        setResponses(defaultResponses);
    }
    setIsLoading(false);
  }, [searchParams]);

  const updateSetting = <K extends keyof FormSettings>(key: K, value: FormSettings[K]) => {
    setFormState(prev => {
        if (!prev) return null;
        return {
            ...prev,
            settings: {
                ...prev.settings,
                [key]: value
            }
        };
    });
  };
  
  if (isLoading || !formState) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Loading form...</p>
        </div>
    );
  }
  
  const handleQuestionChange = (newIndex: number) => {
    if (formState && newIndex >= 0 && newIndex < formState.questions.length) {
      setCurrentQuestionIndex(newIndex);
    }
  };

  const handleResponseChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < responses.length) {
      setCurrentResponseIndex(newIndex);
    }
  };
  
  const handleDeleteResponse = (responseId: string) => {
    setResponses(prev => {
        const newResponses = prev.filter(r => r.id !== responseId);
        if (currentResponseIndex >= newResponses.length) {
            setCurrentResponseIndex(Math.max(0, newResponses.length - 1));
        }
        return newResponses;
    });
  };

  const handleDownloadResponses = (format: 'xlsx' | 'csv') => {
    if (!formState || responses.length === 0) return;

    const formattedData: any[] = [];
    const headers = ["Submitted At", "Responder", ...formState.questions.map(q => q.text)];
    
    formattedData.push(headers);

    responses.forEach(response => {
        const row = [
            response.submittedAt.toLocaleString(),
            response.responder,
            ...formState.questions.map(q => {
                const answer = response.answers[q.id];
                if (answer === undefined || answer === null) return "";
                
                switch(q.type) {
                    case 'checkboxes':
                        return q.options?.filter(o => answer.includes(o.id)).map(o => o.value).join(', ') || "";
                    case 'radio-group':
                    case 'dropdown':
                        return q.options?.find(o => o.id === answer)?.value || answer;
                    case 'address':
                         return `${answer.street1}, ${answer.street2 || ''} ${answer.city}, ${answer.state} ${answer.zip}`;
                    default:
                        return String(answer);
                }
            })
        ];
        formattedData.push(row);
    });
    
    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");

    XLSX.writeFile(workbook, `${formState.title.text}_responses.${format}`);
};

  const currentResponse = responses.length > 0 ? responses[currentResponseIndex] : null;


  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header showDashboardButton={true} />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="questions" className="w-full">
            <div className="flex justify-center mb-8">
                <TabsList className={isMobile ? "grid grid-cols-2 h-auto" : ""}>
                    <TabsTrigger value="questions">
                        <ListChecks className="mr-2 h-4 w-4" /> Questions
                    </TabsTrigger>
                    <TabsTrigger value="responses" className="relative">
                        <LineChart className="mr-2 h-4 w-4" /> Responses
                        {responses.length > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {responses.length}
                          </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="questions">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                <div className="lg:col-span-7">
                    {formState && <FormBuilder formState={formState} setFormState={setFormState} selectedElement={selectedElement} setSelectedElement={setSelectedElement} />}
                </div>
                <div className="hidden lg:block lg:col-span-3">
                    <Card className="sticky top-24 h-fit p-4">
                        {formState && <FloatingToolbar formState={formState} setFormState={setFormState} selectedElement={selectedElement} />}
                    </Card>
                </div>
                </div>
            </TabsContent>
            <TabsContent value="responses">
                 <Card>
                    <CardHeader>
                       <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl">{responses.length} response{responses.length !== 1 && 's'}</CardTitle>
                                <CardDescription>View and analyze the submissions for your form.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={() => handleDownloadResponses('xlsx')} disabled={responses.length === 0}>
                                    <FileDown className="mr-2 h-4 w-4" />
                                    Download (.xlsx)
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleDownloadResponses('csv')}>
                                            <FileDown className="mr-2 h-4 w-4" /> Download responses (.csv)
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => window.print()}>
                                            <Printer className="mr-2 h-4 w-4" /> Print all responses
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete all responses
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="summary" className="w-full">
                            <TabsList>
                                <TabsTrigger value="summary"><BarChartBig className="mr-2 h-4 w-4" />Summary</TabsTrigger>
                                <TabsTrigger value="question"><HelpCircle className="mr-2 h-4 w-4" />Question</TabsTrigger>
                                <TabsTrigger value="individual"><UserSquare className="mr-2 h-4 w-4" />Individual</TabsTrigger>
                                <TabsTrigger value="plagiarism"><ShieldCheck className="mr-2 h-4 w-4" />Plagiarism</TabsTrigger>
                            </TabsList>
                            <TabsContent value="summary" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Responses Summary</CardTitle>
                                        <CardDescription>A summary of responses for each question. This is placeholder data.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                    {formState?.questions.map((question, index) => (
                                        <Card key={question.id} className="pt-6">
                                            <CardContent>
                                                <h3 className="font-semibold mb-4">{index + 1}. {question.text}</h3>
                                                <div className="space-y-2 text-sm">
                                                    {(question.options && question.options.length > 0) ? (
                                                        question.options.map(option => (
                                                            <div key={option.id} className="flex justify-between items-center">
                                                                <span>{option.value}</span>
                                                                <span className="font-medium text-muted-foreground">{Math.floor(Math.random() * 10) + 1} response(s)</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-muted-foreground">{responses.length} response(s)</p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="question" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <Select value={String(currentQuestionIndex)} onValueChange={(val) => handleQuestionChange(Number(val))}>
                                                    <SelectTrigger className="w-[300px]">
                                                        <SelectValue placeholder="Select a question" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {formState.questions.map((q, index) => (
                                                            <SelectItem key={q.id} value={String(index)}>
                                                                {index + 1}. {q.text}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" onClick={() => handleQuestionChange(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0}>
                                                        <ChevronLeft className="h-4 w-4" />
                                                    </Button>
                                                    <span className="text-sm text-muted-foreground">
                                                        {currentQuestionIndex + 1} of {formState.questions.length}
                                                    </span>
                                                    <Button variant="outline" size="icon" onClick={() => handleQuestionChange(currentQuestionIndex + 1)} disabled={currentQuestionIndex === formState.questions.length - 1}>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {responses.length} response(s)
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {formState.questions[currentQuestionIndex] ? (
                                             <Card>
                                                <CardHeader>
                                                    <CardTitle>{formState.questions[currentQuestionIndex].text}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-3">
                                                      {responses.map(response => (
                                                        <li key={response.id} className="border-b pb-2">
                                                            {response.answers[formState.questions[currentQuestionIndex].id] || "No response"}
                                                        </li>
                                                      ))}
                                                    </ul>
                                                </CardContent>
                                             </Card>
                                        ) : (
                                          <p>Select a question to see responses.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="individual" className="mt-6">
                                <Card>
                                    <CardHeader>
                                         <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                  <Button variant="outline" size="icon" onClick={() => handleResponseChange(currentResponseIndex - 1)} disabled={currentResponseIndex === 0}>
                                                      <ChevronLeft className="h-4 w-4" />
                                                  </Button>
                                                  <span className="text-sm text-muted-foreground">
                                                      {currentResponseIndex + 1} of {responses.length}
                                                  </span>
                                                  <Button variant="outline" size="icon" onClick={() => handleResponseChange(currentResponseIndex + 1)} disabled={currentResponseIndex === responses.length - 1}>
                                                      <ChevronRight className="h-4 w-4" />
                                                  </Button>
                                                </div>
                                                {currentResponse && (
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                      <Button variant="destructive" size="icon">
                                                          <Trash2 className="h-4 w-4" />
                                                      </Button>
                                                  </AlertDialogTrigger>
                                                  <AlertDialogContent>
                                                      <AlertDialogHeader>
                                                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                              This action cannot be undone. This will permanently delete this response.
                                                          </AlertDialogDescription>
                                                      </AlertDialogHeader>
                                                      <AlertDialogFooter>
                                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                          <AlertDialogAction onClick={() => handleDeleteResponse(currentResponse.id)}>
                                                              Continue
                                                          </AlertDialogAction>
                                                      </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {currentResponse ? `Submitted on ${currentResponse.submittedAt.toLocaleString()}` : "No response selected"}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {currentResponse ? (
                                            <div>
                                                {formState.questions.map((q) => (
                                                   <ResponseRenderer key={q.id} question={q} answer={currentResponse.answers[q.id]} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-muted-foreground py-10">No responses yet.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="plagiarism" className="mt-6">
                                {formState && (
                                    <PlagiarismReports 
                                        questions={formState.questions}
                                        responses={responses}
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="settings">
                 <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                        <CardDescription>Manage your form's configuration and default behaviors.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {formState && formState.settings && (
                         <Accordion type="multiple" defaultValue={['responses', 'presentation', 'defaults']} className="w-full">
                            <AccordionItem value="quiz">
                                <div className="flex items-center justify-between p-4 border-b">
                                    <div>
                                        <Label htmlFor="quiz-mode" className="text-base">Make this a quiz</Label>
                                        <p className="text-sm text-muted-foreground">Assign point values, set answers, and automatically provide feedback.</p>
                                    </div>
                                    <Switch id="quiz-mode" checked={formState.settings.isQuiz} onCheckedChange={(val) => updateSetting('isQuiz', val)} />
                                </div>
                            </AccordionItem>
                            
                            <AccordionItem value="responses">
                                <AccordionTrigger className="text-lg font-medium">Responses</AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                     <div className="space-y-2">
                                        <Label>Collect email addresses</Label>
                                        <Select value={formState.settings.collectEmail} onValueChange={(val: FormSettings['collectEmail']) => updateSetting('collectEmail', val)}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="do-not-collect">Do not collect</SelectItem>
                                                <SelectItem value="verified-only">Verified</SelectItem>
                                                <SelectItem value="unverified-only">Responder input</SelectItem>
                                            </SelectContent>
                                        </Select>
                                     </div>
                                     <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Send responders a copy of their response</Label>
                                        </div>
                                        <Select value={formState.settings.sendCopyOfResponse} onValueChange={(val: FormSettings['sendCopyOfResponse']) => updateSetting('sendCopyOfResponse', val)} disabled={formState.settings.collectEmail === 'do-not-collect'}>
                                            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="off">Off</SelectItem>
                                                <SelectItem value="when-requested">When requested</SelectItem>
                                                <SelectItem value="always">Always</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="allow-editing">Allow response editing</Label>
                                            <p className="text-sm text-muted-foreground">Responses can be changed after being submitted.</p>
                                        </div>
                                        <Switch id="allow-editing" checked={formState.settings.allowResponseEditing} onCheckedChange={(val) => updateSetting('allowResponseEditing', val)} />
                                    </div>
                                     <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="limit-response">Limit to 1 response</Label>
                                            <p className="text-sm text-muted-foreground">Requires sign-in</p>
                                        </div>
                                        <Switch id="limit-response" checked={formState.settings.limitToOneResponse} onCheckedChange={(val) => updateSetting('limitToOneResponse', val)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="presentation">
                                <AccordionTrigger className="text-lg font-medium">Presentation</AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="shuffle-order">Shuffle question order</Label>
                                        <Switch id="shuffle-order" checked={formState.settings.shuffleQuestionOrder} onCheckedChange={(val) => updateSetting('shuffleQuestionOrder', val)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-msg">Confirmation message</Label>
                                        <Input id="confirm-msg" value={formState.settings.confirmationMessage} onChange={(e) => updateSetting('confirmationMessage', e.target.value)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="submit-another">Show link to submit another response</Label>
                                        <Switch id="submit-another" checked={formState.settings.showLinkToSubmitAnotherResponse} onCheckedChange={(val) => updateSetting('showLinkToSubmitAnotherResponse', val)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="results-summary">View results summary</Label>
                                            <p className="text-sm text-muted-foreground">Responders can see a summary of all responses.</p>
                                        </div>
                                        <Switch id="results-summary" checked={formState.settings.viewResultsSummary} onCheckedChange={(val) => updateSetting('viewResultsSummary', val)} />
                                    </div>
                                     <div className="flex items-center justify-between">
                                        <Label htmlFor="disable-autosave">Disable auto-save for all respondents</Label>
                                        <Switch id="disable-autosave" checked={formState.settings.disableAutoSave} onCheckedChange={(val) => updateSetting('disableAutoSave', val)} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="defaults">
                                <AccordionTrigger className="text-lg font-medium">Defaults</AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-4">
                                     <div>
                                        <h4 className="font-medium">Question defaults</h4>
                                        <p className="text-sm text-muted-foreground mb-4">Settings applied to all new questions.</p>
                                        <div className="flex items-center justify-between">
                                          <Label htmlFor="require-by-default">Make questions required by default</Label>
                                          <Switch id="require-by-default" checked={formState.settings.makeQuestionsRequiredByDefault} onCheckedChange={(val) => updateSetting('makeQuestionsRequiredByDefault', val)} />
                                        </div>
                                     </div>
                                </AccordionContent>
                            </AccordionItem>
                         </Accordion>
                       )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </main>
       {isMobile && formState && (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
                    <Wrench className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-[400px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Editing Tools</SheetTitle>
                    <SheetDescription>
                        Modify fonts, styles, and images for your selected form element.
                    </SheetDescription>
                </SheetHeader>
                 <div className="py-4">
                    <FloatingToolbar formState={formState} setFormState={setFormState} selectedElement={selectedElement} />
                 </div>
            </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

export default function CreateFormPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading form...</p>
      </div>
    }>
      <CreateFormPageContent />
    </Suspense>
  );
}
