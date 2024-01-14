/**
 * @jest-environment jsdom
 */
const highlightText = require('./index').highlightText;

describe('highlightText', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `<h2 class="text-heading-large
    mb4">
    About the job
    </h2>
    
    <!---->            <span>
    <strong><!---->Company Description<!----><br><br></strong><strong><!---->Agile Soul - Software Mind<!----><br><br></strong><!---->Software Mind develops solutions that make an impact for companies around the globe. Operating throughout Europe, the US and LATAM, our diverse team brings together a variety of skills, experiences and perspectives. Tech giants &amp; unicorns, transformative projects, emerging technologies and limitless opportunities – these are a few words that describe an average day for us. Building cross-functional engineering teams that take ownership and crave more means we’re always on the lookout for talented people who bring passion and creativity to every project. Our culture is driven by trust – it embraces openness, acts with respect, shows grit &amp; guts and combines employment with enjoyment.<!----><br><br><strong><!---->Job Description<!----><br><br></strong><strong><!---->Project - the aim you'll have<!----><br><br></strong><!---->We are currently in search of a skilled JavaScript Developer specializing in Progressive Web Applications (PWAs) to join the team of our client, a prominent supplier of broadcast reception equipment.<!----><br><br><strong><!---->Position - How You'll Contribute<!----><br><br></strong>      <ul><li><!---->Design, develop, and optimize Progressive Web Applications.<!----></li><li><!---->Work with cross-functional teams to create high-performance web applications for embedded products such as set-top boxes, home routers, networking devices, and gateways.<!----></li><li><!---->Need to have a strong foundation in front-end development, with a proven track record in building PWAs apps.<!----></li><li><!---->Collaborate with UI/UX designers to implement PWA features and ensure a seamless user experience across devices.<!----></li><li><!---->Work closely with backend developers to integrate PWA functionality with server-side logic.<!----></li><li><!---->Implement service workers, offline functionality, and other PWA features to enhance application performance and reliability.<!----></li><li><!---->Optimize PWAs for various devices and browsers, ensuring a consistent and smooth experience.<!----></li><li><!---->Conduct code reviews to ensure adherence to PWA standards and overall code quality.<!----></li><li><!---->Troubleshoot and debug PWA-related issues, providing effective and timely solutions.<!----><br><br></li></ul>
    <strong><!---->Qualifications<!----><br><br></strong><strong><!---->Expectations - the experience you need<!----><br><br></strong>      <ul><li><!---->Proven experience as a JavaScript Developer with a focus on Progressive Web Applications or web GUI for embedded devices/routers.<!----></li><li><!---->Strong proficiency in JavaScript, HTML, and CSS.<!----></li><li><!---->Experience with popular JavaScript frameworks/libraries (e.g., React, Angular, or Vue.js).<!----></li><li><!---->Knowledge of responsive design principles and cross-browser compatibility.<!----></li><li><!---->Familiarity with version control systems (e.g., Git) and build tools (e.g., Webpack).<!----></li><li><!---->Strong problem-solving skills and attention to detail.<!----></li><li><!---->Good communication and collaboration skills.<!----><br><br></li></ul>
    <strong><!---->Additional Skills - The Edge You Have<!----><br><br></strong>      <ul><li><!---->In-depth understanding of PWA principles, service workers, and offline functionality.<!----></li><li><!---->Familiarity with PWA testing frameworks and tools.<!----></li><li><!---->Understanding of security best practices in PWA development.<!----></li><li><!---->Knowledge of performance optimization techniques for PWAs.<!----></li><li><!---->Experience with implementing push notifications in PWAs.<!----><br><br></li></ul>
    <strong><!---->Additional Information<!----><br><br></strong><strong><!---->Position at: Software Mind Moldova<!----><br><br></strong><!---->Why us? Because there are many perks waiting for you:<!----><br><br>      <ul><li><!---->Competitive salary &amp; periodical review;<!----></li><li><!---->New technologies &amp; experience working on international projects;<!----></li><li><!---->Flexible working hours and the option to work from home with a monthly additional bonus;<!----></li><li><!---->An agile, supportive, and non-bureaucratic organizational culture;<!----></li><li><!---->Monthly Lunch Tickets received on card;<!----></li><li><!---->Additional medical insurance, paid sick leaves and sports membership reimbursement;<!----></li><li><!---->Financial support for Training &amp; Courses, as well as free online English classes with native speakers;<!----></li><li><!---->Paid Team Building Activities based on Projects and Interests;<!----></li><li><!---->More intriguing benefits will be revealed during our online interviews...<!----></li></ul>
    
    <!---->            </span>`;
  });

  afterEach(() => {
    container = null;
    global.chrome.runtime.onMessage.addListener.mockClear();
  });

  it('should highlight the specified text in the container', () => {
    const textToHighlight =
      '<li>In-depth understanding of PWA principles, service workers, and offline functionality.</li>';
    const highlightStyle = 'background-color: yellow;';

    highlightText(textToHighlight, container, highlightStyle);
    const highlightedText = container.innerHTML;
    expect(highlightedText).toContain(
      `<div style="${highlightStyle}">${textToHighlight}</div>`
    );
  });
});
