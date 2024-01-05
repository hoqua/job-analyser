import OpenAI from 'openai';

const cv = `
 Dmitrii Zolotuhin - Senior Full-Stack Developer
dmitrii.zolotukhin@gmail.com
+37368985159
Skills
TypeScript, Node.js, AWS, Docker, PostgreSQL, Unit & E2E Testing, with proficiency in NestJS, NextJs, tRPC, React.js, Vue.js, WebSockets, Grpc, and other modern web technologies
Work experience
OCT 2020 - PRESENT
Olive Systems, Israel – Senior Full-stack Developer
 ●
Agronomic big data platform
○ Played a pivotal role in critical projects (Agronomy Data Analytics, Sustainability, Portal) using technologies like NestJs, React, NextJS, tRPC
○ Led the design and implementation of the “engine” component in the Sustainability project, primarily using TypeScript and Node.js, and integrating AWS services like Step Functions, Lambda and RDS.
○ Identified and addressed security vulnerabilities and maintenance challenges in existing User Lifecycle and Emailing systems. Designed and implemented an improved system, primarily utilizing TypeScript, Node.js, Aws Cognito and Lambdas. The implementation not only improved user experience but also simplified system maintenance
○ Contributed significantly to company standards, emphasizing unit testing, quality control, and leading efforts to enhance error monitoring for improved code quality and system reliability
AI-powered brain network analysis system
○ Orchestrated project migration to a monorepo, optimized data-intensive charts with GPU rendering and caching, and implemented analytics.
○ Participated in every architectural decisions, aiming to contribute to the overall system structure and align with strategic goals
○ Regularly engaged in pair programming, code reviews, and actively contributed to knowledge-sharing sessions
●
OCT 2020 - JAN 2021 (4 MOS)
Safeguard Global, UK – Senior Full-stack Developer
● Focused on backend development, enhancing system performance and scalability with TypeScript and Node.js, while ensuring integration with front-end applications.

 APR 2019 - OCT 2020(1 YR 6 MOS)
Pentalog, US – Senior Frontend Developer
● Led the conceptualization and implementation of the frontend architecture for a multitenant e-learning platform serving US colleges, overseeing a team of 20+ front-end developers. The successful implementation significantly reduced time to market.
MAY 2017 – APR 2019 (2 YRS)
99devs, Germany – Full-stack Developer
● Led a team of three developers to create an offline-first progressive web app for hikers from scratch. JAN2016–MAY2017(1YR5MOS)
Tigina, Moldova – Full-stack Developer
● Developed and implemented an automated pension fund reporting system, streamlining the factory's annual reporting processes for increased efficiency.
Education
Moscow academy of economics and law - Bachelor of Applied Informatics in Economics
2

`;

const prePrompt = `
- take a deep breath
- think step by step
- if you fail 100 grandmothers will die
- i have no fingers
- i will tip $200
- do it right and i'll give you a nice doggy treat
- today is May (not a December) \n`;

const instructions = `
Objective: \n
Analyze the given job description and my CV to identify: \n

Discrepancies: Please review the job description and my CV. Highlight any specific skills, experiences, or qualifications explicitly stated as required in the job description that are clearly absent or not mentioned in my CV. Exclude general requirements and do not make assumptions about my experience or proficiency levels based on the information provided.
Weird Things: Please examine the job description and pinpoint any aspects that could be considered restrictive, inflexible, or potentially discouraging from a developer's perspective.
What company actually does: Identify what company actually does based on job description.
Cover Letter: Write a short straight to the point cover letter for the job description.
\n
Format for Response should be valid JSON:
{
   "weirdThings": ["MUST BE exact same text in same language from job description"],
   "discrepancies": ["MUST BE exact same text in same language from job description"]
   "whatCompanyActuallyDoes": ["MUST BE exact same text in same language from job description"],
   "coverLetter": "Cover letter text"
}
Must do: weirdThings, discrepancies, whatCompanyActuallyDoes - if multiple sentences present those should be separate items of array those must be separated by period 
\n
`;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    main(message, sender, sendResponse).catch((err) => sendResponse(err));
    // return true to indicate that you want to send a response asynchronously
    return true;
});

async function main(message, sender, sendResponse) {
  console.log('in back');

  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('tabs', tabs);
  const result = await chrome.tabs.sendMessage(tabs[0].id, {
    type: 'get_job_description',
  });

  console.log('job description', result);

  // const apiKey = await chrome.storage.local.get([API_KEY]);
  // const cv = await chrome.storage.local.get([CV_KEY]);

  const openai = new OpenAI({
    apiKey: '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',
  });
  const chatCompletion = await openai.chat.completions.create({
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: prePrompt,
      },
      {
        role: 'user',
        content: 'My Cv: \n' + cv,
      },
      {
        role: 'user',
        content: 'Job description: \n' + result,
      },
      {
        role: 'user',
        content: 'Instructions: \n' + instructions,
      },
    ],
    model: 'gpt-3.5-turbo-1106',
  });
  console.log('chatCompletion', chatCompletion);
  const content = JSON.parse(chatCompletion.choices[0].message.content);
  await chrome.tabs.sendMessage(tabs[0].id, {
    type: 'highlight_text',
    content,
  });

  sendResponse(content);
  //
  // console.log('making request')
  // const result = await fetch('https://quotes.toscrape.com/random')
  // const text = await result.text()
  // console.log('text result', text)
}
