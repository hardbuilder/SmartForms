"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, Eye, Download, RefreshCw, TrendingUp, Users, FileText, Search, Flag, CheckCircle, XCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  generatePlagiarismReport,
  getRiskLevel,
  type PlagiarismReport,
  type PlagiarismResult
} from "@/lib/plagiarism-detection";
import type { Question } from "@/components/form-builder";

type IndividualResponse = {
  id: string;
  submittedAt: Date;
  responder: string;
  answers: Record<string, any>;
};

type PlagiarismReportsProps = {
  questions: Question[];
  responses: IndividualResponse[];
};

export default function PlagiarismReports({ questions, responses }: PlagiarismReportsProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<Record<string, PlagiarismReport>>({});

  // Filter questions that can be analyzed for plagiarism (text-based responses)
  const analyzableQuestions = questions.filter(
    q => q.type === "short-answer" || q.type === "paragraph"
  );

  // Set default question if none selected
  useEffect(() => {
    if (!selectedQuestionId && analyzableQuestions.length > 0) {
      setSelectedQuestionId(analyzableQuestions[0].id);
    }
  }, [selectedQuestionId, analyzableQuestions]);

  // Generate plagiarism reports for text-based questions
  const generateReports = async () => {
    setLoading(true);
    const newReports: Record<string, PlagiarismReport> = {};

    for (const question of analyzableQuestions) {
      const textResponses = responses
        .map(response => ({
          id: response.id,
          responder: response.responder,
          text: response.answers[question.id] || "",
          submittedAt: response.submittedAt
        }))
        .filter(r => r.text && r.text.length > 10); // Only analyze meaningful text responses

      if (textResponses.length >= 2) {
        newReports[question.id] = generatePlagiarismReport(
          question.id,
          question.text,
          textResponses
        );
      }
    }

    setReports(newReports);
    setLoading(false);
  };

  // Auto-generate reports when component mounts
  useEffect(() => {
    if (analyzableQuestions.length > 0 && responses.length > 0) {
      generateReports();
    }
  }, [analyzableQuestions.length, responses.length]);

  const currentReport = selectedQuestionId ? reports[selectedQuestionId] : null;

  // Overall statistics across all questions
  const overallStats = useMemo(() => {
    const allReports = Object.values(reports);
    if (allReports.length === 0) return null;

    const totalResponses = allReports.reduce((sum, report) => sum + report.overallStats.totalResponses, 0);
    const totalSuspicious = allReports.reduce((sum, report) => sum + report.overallStats.suspiciousResponses, 0);
    const averageSimilarity = allReports.reduce((sum, report) => sum + report.overallStats.averageSimilarity, 0) / allReports.length;

    return {
      totalResponses,
      totalSuspicious,
      averageSimilarity: Math.round(averageSimilarity),
      suspicionRate: Math.round((totalSuspicious / totalResponses) * 100)
    };
  }, [reports]);

  if (analyzableQuestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Plagiarism Reports
          </CardTitle>
          <CardDescription>
            No text-based questions found. Plagiarism detection is only available for short answer and paragraph questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-10">
          <div className="text-muted-foreground">
            Add some short answer or paragraph questions to enable plagiarism detection.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Statistics Dashboard */}
      {overallStats && (
        <div className="space-y-4">
          {/* Alert Banner */}
          {overallStats.suspicionRate > 30 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-yellow-800">
                      High Plagiarism Alert
                    </div>
                    <div className="text-xs text-yellow-700">
                      {overallStats.suspicionRate}% of responses show suspicious patterns. Review flagged submissions.
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="border-yellow-300">
                    <Flag className="h-4 w-4 mr-2" />
                    Review All
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{overallStats.totalResponses}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Responses</div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analyzed submissions
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-red-600">{overallStats.totalSuspicious}</div>
                    <div className="text-sm text-muted-foreground font-medium">Flagged</div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-red-600 font-medium">
                  <XCircle className="h-3 w-3 mr-1" />
                  Requires review
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-600">{overallStats.averageSimilarity}%</div>
                    <div className="text-sm text-muted-foreground font-medium">Avg. Similarity</div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-muted-foreground">
                  <Search className="h-3 w-3 mr-1" />
                  Text similarity index
                </div>
              </CardContent>
            </Card>
            
            <Card className={cn("relative overflow-hidden border-2", {
              "border-green-200 bg-green-50": overallStats.suspicionRate < 20,
              "border-yellow-200 bg-yellow-50": overallStats.suspicionRate >= 20 && overallStats.suspicionRate < 50,
              "border-red-200 bg-red-50": overallStats.suspicionRate >= 50
            })}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={cn("text-3xl font-bold", {
                      "text-green-600": overallStats.suspicionRate < 20,
                      "text-yellow-600": overallStats.suspicionRate >= 20 && overallStats.suspicionRate < 50,
                      "text-red-600": overallStats.suspicionRate >= 50
                    })}>
                      {overallStats.suspicionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Risk Level</div>
                  </div>
                  <div className={cn("p-3 rounded-full", {
                    "bg-green-100": overallStats.suspicionRate < 20,
                    "bg-yellow-100": overallStats.suspicionRate >= 20 && overallStats.suspicionRate < 50,
                    "bg-red-100": overallStats.suspicionRate >= 50
                  })}>
                    {overallStats.suspicionRate < 20 ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : overallStats.suspicionRate < 50 ? (
                      <AlertTriangle className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs font-medium">
                  <div className={cn("", {
                    "text-green-600": overallStats.suspicionRate < 20,
                    "text-yellow-600": overallStats.suspicionRate >= 20 && overallStats.suspicionRate < 50,
                    "text-red-600": overallStats.suspicionRate >= 50
                  })}>
                    {overallStats.suspicionRate < 20 ? "✓ Low Risk" : overallStats.suspicionRate < 50 ? "⚠ Medium Risk" : "⚠ High Risk"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Main Report */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Plagiarism Analysis
              </CardTitle>
              <CardDescription>
                Detect potential plagiarism in text-based responses using similarity analysis.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={generateReports} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                {loading ? "Analyzing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Question Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Question:</label>
              <Select value={selectedQuestionId} onValueChange={setSelectedQuestionId}>
                <SelectTrigger className="w-[400px]">
                  <SelectValue placeholder="Select a question" />
                </SelectTrigger>
                <SelectContent>
                  {analyzableQuestions.map((question, index) => (
                    <SelectItem key={question.id} value={question.id}>
                      {index + 1}. {question.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {loading && (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <div>Analyzing responses for plagiarism...</div>
              </div>
            )}

            {currentReport && !loading && (
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
                  <TabsTrigger value="suspicious">Suspicious Only</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-4">
                    {/* Question Statistics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Question Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{currentReport.overallStats.totalResponses}</div>
                            <div className="text-sm text-muted-foreground">Responses</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{currentReport.overallStats.lowRiskCount}</div>
                            <div className="text-sm text-muted-foreground">Low Risk</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{currentReport.overallStats.mediumRiskCount}</div>
                            <div className="text-sm text-muted-foreground">Medium Risk</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{currentReport.overallStats.highRiskCount}</div>
                            <div className="text-sm text-muted-foreground">High Risk</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold">{currentReport.overallStats.averageSimilarity}%</div>
                            <div className="text-sm text-muted-foreground">Avg Similarity</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{currentReport.overallStats.suspiciousResponses}</div>
                            <div className="text-sm text-muted-foreground">Suspicious</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Risk Distribution */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Risk Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Low Risk</span>
                            <span className="text-sm font-medium">{currentReport.overallStats.lowRiskCount} responses</span>
                          </div>
                          <Progress 
                            value={(currentReport.overallStats.lowRiskCount / currentReport.overallStats.totalResponses) * 100} 
                            className="h-2" 
                          />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Medium Risk</span>
                            <span className="text-sm font-medium">{currentReport.overallStats.mediumRiskCount} responses</span>
                          </div>
                          <Progress 
                            value={(currentReport.overallStats.mediumRiskCount / currentReport.overallStats.totalResponses) * 100} 
                            className="h-2" 
                          />
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm">High Risk</span>
                            <span className="text-sm font-medium">{currentReport.overallStats.highRiskCount} responses</span>
                          </div>
                          <Progress 
                            value={(currentReport.overallStats.highRiskCount / currentReport.overallStats.totalResponses) * 100} 
                            className="h-2" 
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="detailed" className="mt-4">
                  <div className="space-y-4">
                    {currentReport.responses
                      .sort((a, b) => b.plagiarismResult.score - a.plagiarismResult.score)
                      .map((response) => {
                        const risk = getRiskLevel(response.plagiarismResult.score);
                        return (
                          <Card key={response.responseId}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{response.responder}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Submitted: {response.submittedAt.toLocaleString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    Score: {response.plagiarismResult.score}%
                                  </Badge>
                                  <Badge className={cn("", {
                                    "bg-green-100 text-green-800": response.plagiarismResult.score <= 40,
                                    "bg-yellow-100 text-yellow-800": response.plagiarismResult.score > 40 && response.plagiarismResult.score <= 70,
                                    "bg-red-100 text-red-800": response.plagiarismResult.score > 70
                                  })}>
                                    {risk.level}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="text-sm font-medium mb-2">Response Text:</div>
                                  <div className="p-3 bg-muted rounded-md text-sm">
                                    {response.text}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm font-medium mb-2">Analysis:</div>
                                    <div className="text-sm space-y-1">
                                      <div>Similarity: {response.plagiarismResult.analysis.similarityPercentage.toFixed(1)}%</div>
                                      <div>Unique Words: {response.plagiarismResult.analysis.uniqueWords}/{response.plagiarismResult.analysis.totalWords}</div>
                                      <div>Confidence: {response.plagiarismResult.confidence}</div>
                                    </div>
                                  </div>

                                  {response.plagiarismResult.analysis.suspiciousPhrases.length > 0 && (
                                    <div>
                                      <div className="text-sm font-medium mb-2">Suspicious Patterns:</div>
                                      <div className="text-sm">
                                        {response.plagiarismResult.analysis.suspiciousPhrases.map((phrase, index) => (
                                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                                            {phrase}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {response.plagiarismResult.matches.length > 0 && (
                                  <div>
                                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                      Similar Responses Found:
                                    </div>
                                    <div className="space-y-2">
                                      {response.plagiarismResult.matches.map((match) => (
                                        <div key={match.id} className="p-2 border rounded-md text-sm">
                                          <div className="font-medium">Similarity: {match.similarity.toFixed(1)}%</div>
                                          <div className="text-muted-foreground mt-1">
                                            {match.matchedText.substring(0, 100)}...
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </TabsContent>

                <TabsContent value="suspicious" className="mt-4">
                  <div className="space-y-4">
                    {currentReport.responses
                      .filter(response => response.plagiarismResult.score > 40)
                      .sort((a, b) => b.plagiarismResult.score - a.plagiarismResult.score)
                      .map((response) => {
                        const risk = getRiskLevel(response.plagiarismResult.score);
                        return (
                          <Card key={response.responseId} className="border-red-200">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    {response.responder}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Submitted: {response.submittedAt.toLocaleString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="destructive">
                                    Score: {response.plagiarismResult.score}%
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <div className="text-sm font-medium mb-2">Response Text:</div>
                                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                                    {response.text}
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm font-medium mb-2 text-red-700">Risk Factors:</div>
                                    <div className="text-sm space-y-1">
                                      <div>High similarity: {response.plagiarismResult.analysis.similarityPercentage.toFixed(1)}%</div>
                                      {response.plagiarismResult.matches.length > 0 && (
                                        <div>Matches found: {response.plagiarismResult.matches.length}</div>
                                      )}
                                      {response.plagiarismResult.analysis.suspiciousPhrases.length > 0 && (
                                        <div>Suspicious patterns: {response.plagiarismResult.analysis.suspiciousPhrases.length}</div>
                                      )}
                                    </div>
                                  </div>

                                  {response.plagiarismResult.analysis.commonPhrases.length > 0 && (
                                    <div>
                                      <div className="text-sm font-medium mb-2">Common Phrases:</div>
                                      <div className="text-sm">
                                        {response.plagiarismResult.analysis.commonPhrases.slice(0, 5).map((phrase, index) => (
                                          <Badge key={index} variant="outline" className="mr-1 mb-1 text-xs">
                                            {phrase}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    
                    {currentReport.responses.filter(response => response.plagiarismResult.score > 40).length === 0 && (
                      <Card>
                        <CardContent className="text-center py-10">
                          <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                          <div className="text-lg font-medium text-green-700">No Suspicious Responses</div>
                          <div className="text-sm text-muted-foreground">
                            All responses appear to be original content.
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
