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
Analyze the provided job description HTML and my CV, focusing especially on retaining all HTML elements and special characters, including comment tags like '\x3C!---->', in your analysis and response.

1. Discrepancies: Compare the job description with my CV and identify skills and experiences in the job description that are not in my CV. Return these as an exact HTML substring array, ensuring to include all special characters and comments.

2. Weird Things: Examine the job description for elements that might seem restrictive or discouraging to a developer. Highlight these as an exact HTML substring array, including all special characters and comments.

3. Company Profile: Based on the job description, describe what the company does.

4. Cover Letter: Draft a concise cover letter tailored to the job description.

Provide results in JSON format:
{
   "weirdThings": [],
   "discrepancies": [],
   "companyProfile": [],
   "coverLetter": ""
}

Emphasize that all HTML content must be accurately represented in the response.

`;

const API_KEY = 'API_KEY';
const CV_KEY = 'CV_KEY';

// chrome.webNavigation.onHistoryStateUpdated.addListener(handler);
//
// async function handler(details) {
//   console.log('onCompleted', details);
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     chrome.tabs.reload(tabs[0].id);
//   });
// }

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
    content: {
      url: tabs[0].url,
    },
  });

  console.log('job description', result);

  // const apiKey = await chrome.storage.local.get([API_KEY]);
  // const cv = await chrome.storage.local.get([CV_KEY]);

  const openai = new OpenAI({
    apiKey: '',
  });
  const chatCompletion = await openai.chat.completions
    .create({
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
      model: 'gpt-4',
    })
    .catch((err) => console.log('err', err));
  console.log('chatCompletion', chatCompletion);
  const content = JSON.parse(chatCompletion.choices[0].message.content);
  await chrome.tabs.sendMessage(tabs[0].id, {
    type: 'highlight_text',
    content: {
      ...content,
      url: tabs[0].url,
    },
  });

  // chrome.tabs.getSelected(null, function(tab) {
  //   var code = 'window.location.reload();';
  //   chrome.tabs.executeScript(tab.id, {code: code});
  // });

  sendResponse(content);
  //
  // console.log('making request')
  // const result = await fetch('https://quotes.toscrape.com/random')
  // const text = await result.text()
  // console.log('text result', text)
}
