// Plagiarism Detection Utilities
export type PlagiarismResult = {
  score: number; // 0-100, where 100 is most likely plagiarized
  confidence: 'low' | 'medium' | 'high';
  matches: PlagiarismMatch[];
  analysis: {
    similarityPercentage: number;
    uniqueWords: number;
    totalWords: number;
    commonPhrases: string[];
    suspiciousPhrases: string[];
  };
};

export type PlagiarismMatch = {
  id: string;
  text: string;
  similarity: number;
  matchedWith: string; // ID of the response it matches with
  matchedText: string;
  startPosition: number;
  endPosition: number;
};

export type PlagiarismReport = {
  questionId: string;
  questionText: string;
  responses: Array<{
    responseId: string;
    responder: string;
    text: string;
    plagiarismResult: PlagiarismResult;
    submittedAt: Date;
  }>;
  overallStats: {
    totalResponses: number;
    suspiciousResponses: number;
    averageSimilarity: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
  };
};

// Simple text similarity calculation using Jaccard similarity
function calculateJaccardSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(word => word.length > 2));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(word => word.length > 2));
  
  const intersection = new Set([...words1].filter(word => words2.has(word)));
  const union = new Set([...words1, ...words2]);
  
  return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
}

// Find common phrases between two texts
function findCommonPhrases(text1: string, text2: string, minLength: number = 3): string[] {
  const phrases1 = extractPhrases(text1, minLength);
  const phrases2 = extractPhrases(text2, minLength);
  
  return phrases1.filter(phrase => phrases2.includes(phrase));
}

// Extract phrases of given length from text
function extractPhrases(text: string, minLength: number): string[] {
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const phrases: string[] = [];
  
  for (let i = 0; i <= words.length - minLength; i++) {
    for (let j = minLength; j <= Math.min(words.length - i, 8); j++) {
      phrases.push(words.slice(i, i + j).join(' '));
    }
  }
  
  return phrases;
}

// Detect suspicious patterns that might indicate plagiarism
function detectSuspiciousPatterns(text: string): string[] {
  const suspicious: string[] = [];
  
  // Check for repeated exact phrases
  const phrases = extractPhrases(text, 4);
  const phraseCount: Record<string, number> = {};
  
  phrases.forEach(phrase => {
    phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
  });
  
  Object.entries(phraseCount).forEach(([phrase, count]) => {
    if (count > 1 && phrase.split(' ').length >= 4) {
      suspicious.push(phrase);
    }
  });
  
  // Check for overly complex vocabulary (potential copy-paste indicator)
  const words = text.split(/\s+/);
  const complexWords = words.filter(word => word.length > 8);
  if (complexWords.length / words.length > 0.3) {
    suspicious.push("High ratio of complex words detected");
  }
  
  // Check for inconsistent writing style (basic check)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceLengths = sentences.map(s => s.split(/\s+/).length);
  const avgLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / sentenceLengths.length;
  
  if (variance > 50) {
    suspicious.push("Inconsistent sentence structure detected");
  }
  
  return suspicious;
}

// Main function to analyze plagiarism between responses
export function analyzePlagiarism(
  targetText: string,
  otherResponses: Array<{ id: string; text: string; responder: string }>
): PlagiarismResult {
  const matches: PlagiarismMatch[] = [];
  let maxSimilarity = 0;
  const commonPhrases: string[] = [];
  
  // Compare with other responses
  otherResponses.forEach(response => {
    const similarity = calculateJaccardSimilarity(targetText, response.text);
    const phrases = findCommonPhrases(targetText, response.text);
    
    if (similarity > 30) { // Consider 30% similarity as suspicious
      matches.push({
        id: crypto.randomUUID(),
        text: targetText,
        similarity,
        matchedWith: response.id,
        matchedText: response.text,
        startPosition: 0,
        endPosition: targetText.length
      });
    }
    
    maxSimilarity = Math.max(maxSimilarity, similarity);
    commonPhrases.push(...phrases);
  });
  
  // Detect suspicious patterns
  const suspiciousPhrases = detectSuspiciousPatterns(targetText);
  
  // Calculate overall score
  const words = targetText.split(/\s+/).filter(word => word.length > 0);
  const uniqueWords = new Set(words.map(word => word.toLowerCase())).size;
  
  let score = 0;
  score += Math.min(maxSimilarity, 70); // Similarity contributes up to 70 points
  score += Math.min(suspiciousPhrases.length * 5, 20); // Suspicious patterns add up to 20 points
  score += Math.min((words.length - uniqueWords) / words.length * 10, 10); // Repetition adds up to 10 points
  
  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high';
  if (score > 70) confidence = 'high';
  else if (score > 40) confidence = 'medium';
  else confidence = 'low';
  
  return {
    score: Math.min(Math.round(score), 100),
    confidence,
    matches,
    analysis: {
      similarityPercentage: maxSimilarity,
      uniqueWords,
      totalWords: words.length,
      commonPhrases: [...new Set(commonPhrases)].slice(0, 10), // Top 10 common phrases
      suspiciousPhrases
    }
  };
}

// Generate a comprehensive plagiarism report for a question
export function generatePlagiarismReport(
  questionId: string,
  questionText: string,
  responses: Array<{ id: string; responder: string; text: string; submittedAt: Date }>
): PlagiarismReport {
  const analyzedResponses = responses.map(response => {
    const otherResponses = responses
      .filter(r => r.id !== response.id)
      .map(r => ({ id: r.id, text: r.text, responder: r.responder }));
    
    return {
      responseId: response.id,
      responder: response.responder,
      text: response.text,
      plagiarismResult: analyzePlagiarism(response.text, otherResponses),
      submittedAt: response.submittedAt
    };
  });
  
  // Calculate overall statistics
  const totalResponses = analyzedResponses.length;
  const suspiciousResponses = analyzedResponses.filter(r => r.plagiarismResult.score > 40).length;
  const averageSimilarity = analyzedResponses.reduce((sum, r) => sum + r.plagiarismResult.analysis.similarityPercentage, 0) / totalResponses;
  
  const highRiskCount = analyzedResponses.filter(r => r.plagiarismResult.score > 70).length;
  const mediumRiskCount = analyzedResponses.filter(r => r.plagiarismResult.score > 40 && r.plagiarismResult.score <= 70).length;
  const lowRiskCount = analyzedResponses.filter(r => r.plagiarismResult.score <= 40).length;
  
  return {
    questionId,
    questionText,
    responses: analyzedResponses,
    overallStats: {
      totalResponses,
      suspiciousResponses,
      averageSimilarity: Math.round(averageSimilarity),
      highRiskCount,
      mediumRiskCount,
      lowRiskCount
    }
  };
}

// Helper function to get risk level based on score
export function getRiskLevel(score: number): { level: string; color: string; description: string } {
  if (score > 70) {
    return {
      level: 'High Risk',
      color: 'text-red-600',
      description: 'High likelihood of plagiarism detected'
    };
  } else if (score > 40) {
    return {
      level: 'Medium Risk',
      color: 'text-yellow-600',
      description: 'Some suspicious similarities found'
    };
  } else {
    return {
      level: 'Low Risk',
      color: 'text-green-600',
      description: 'Appears to be original content'
    };
  }
}
