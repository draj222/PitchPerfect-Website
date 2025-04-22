import OpenAI from 'openai';
import User, { IUser } from '../models/User.ts';
import Job, { IJob } from '../models/Job.ts';
import Match from '../models/Match.ts';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calculate match score between a job and a user
 * Uses OpenAI to analyze compatibility and explain the match
 */
export const calculateMatchScore = async (job: IJob, user: IUser): Promise<{ score: number; reason: string }> => {
  try {
    // Prepare data for OpenAI
    const jobData = {
      title: job.title,
      description: job.description,
      companyStage: job.companyStage,
      role: job.role,
      skills: job.skills,
      industry: job.industry,
      remote: job.remote,
    };

    const userData = {
      skills: user.skills || [],
      businessExpertise: user.businessExpertise || [],
      professionalHistory: user.professionalHistory || [],
      education: user.education || [],
      achievements: user.achievements || [],
      interests: user.interests || [],
    };

    // Create a prompt for OpenAI
    const prompt = `
    I need to calculate a match score between a job posting and a candidate.
    
    JOB POSTING:
    Title: ${jobData.title}
    Description: ${jobData.description}
    Company Stage: ${jobData.companyStage}
    Role: ${jobData.role}
    Required Skills: ${jobData.skills.join(', ')}
    Industry: ${jobData.industry.join(', ')}
    Remote: ${jobData.remote ? 'Yes' : 'No'}
    
    CANDIDATE:
    Skills: ${userData.skills.join(', ')}
    Business Expertise: ${userData.businessExpertise.join(', ')}
    Professional History: ${JSON.stringify(userData.professionalHistory)}
    Education: ${JSON.stringify(userData.education)}
    Achievements: ${JSON.stringify(userData.achievements)}
    Interests: ${userData.interests.join(', ')}
    
    Based on the above data, please:
    1. Calculate a match score between 0 and 100, where 100 is a perfect match
    2. Provide a brief explanation for the score (maximum 150 words)
    3. Return ONLY a JSON object with two fields: "score" (number) and "reason" (string)
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are an expert talent matching AI that analyzes job and candidate data to calculate compatibility.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 500,
    });

    // Parse the response
    const content = response.choices[0]?.message?.content || '';
    
    try {
      // Extract JSON from the response (handle cases where OpenAI might add extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          score: Math.min(Math.max(parseInt(result.score) || 0, 0), 100),
          reason: result.reason || 'No reason provided',
        };
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
    }

    // Fallback if parsing fails
    return {
      score: 50,
      reason: 'Match score calculated based on skill overlap and experience relevance.',
    };
  } catch (error) {
    console.error('Error calculating match score:', error);
    return {
      score: 0,
      reason: 'Error calculating match score',
    };
  }
};

/**
 * Generate matches for a job
 * Finds suitable candidates and creates match records
 */
export const generateJobMatches = async (jobId: string): Promise<void> => {
  try {
    // Find the job
    const job = await Job.findById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Find potential candidates (excluding the job creator)
    const candidates = await User.find({
      _id: { $ne: job.creator },
      role: { $in: ['engineer', 'both'] },
      profileCompleted: true,
      // Can add more filters based on user preferences
    }).limit(20); // Limit to avoid too many API calls

    // Process each candidate
    for (const candidate of candidates) {
      // Check if a match already exists
      const existingMatch = await Match.findOne({
        job: job._id,
        candidate: candidate._id,
      });

      // Skip if match already exists
      if (existingMatch) {
        continue;
      }

      // Calculate match score
      const { score, reason } = await calculateMatchScore(job, candidate);

      // Create match if score is above threshold
      if (score >= 40) { // Minimum threshold for a match
        await Match.create({
          job: job._id,
          candidate: candidate._id,
          score,
          aiMatchingReason: reason,
          status: 'pending',
        });
      }
    }
  } catch (error) {
    console.error('Error generating job matches:', error);
    throw error;
  }
};

/**
 * Generate matches for a user
 * Finds suitable jobs and creates match records
 */
export const generateUserMatches = async (userId: string): Promise<void> => {
  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Find active jobs (excluding those created by the user)
    const jobs = await Job.find({
      creator: { $ne: user._id },
      active: true,
      // Can add more filters based on user preferences
    }).limit(20); // Limit to avoid too many API calls

    // Process each job
    for (const job of jobs) {
      // Check if a match already exists
      const existingMatch = await Match.findOne({
        job: job._id,
        candidate: user._id,
      });

      // Skip if match already exists
      if (existingMatch) {
        continue;
      }

      // Calculate match score
      const { score, reason } = await calculateMatchScore(job, user);

      // Create match if score is above threshold
      if (score >= 40) { // Minimum threshold for a match
        await Match.create({
          job: job._id,
          candidate: user._id,
          score,
          aiMatchingReason: reason,
          status: 'pending',
        });
      }
    }
  } catch (error) {
    console.error('Error generating user matches:', error);
    throw error;
  }
}; 