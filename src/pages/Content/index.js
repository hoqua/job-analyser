const he = require('he');

const siteToQuerySelectorMap = {
  'www.linkedin.com':
    '#job-details',
};

chrome.runtime.onMessage.addListener(main);

function main(request, sender, sendResponse) {
  console.log('in content', request);

  if (request.type === 'get_job_description') {
    const htmlString = document.querySelector(
      '#job-details'
    )?.innerHTML;

    console.log('htmlString', htmlString)
    const text = he.decode(htmlString);
    console.log('text', text.toString())
    sendResponse(text);
  }

  if (request.type === 'highlight_text') {
    const container = document.querySelector('#job-details');
    if (!container) return;

    console.log('content highlight_text request', request);
    for (const discrepancy of request.content.discrepancies) {
      console.log('discrepancy', discrepancy);

      highlightText(discrepancy, container, 'background-color: yellow', );
    }

    for (const weirdThing of request.content.weirdThings) {
      console.log('weirdThing', weirdThing);
      highlightText(weirdThing, container, 'background-color: red');
    }

    for (const companyProfile of request.content.companyProfile) {
      console.log('weirdThing', companyProfile);
      highlightText(companyProfile, container, 'background-color: green');
    }
    sendResponse(undefined);
  }
}

function highlightText(textToHighlight, container, highlightStyle) {
  // Get the HTML of the container
  const htmlEncoded = container.innerHTML;
  const htmlDecoded = he.decode(htmlEncoded);
  console.log('decoded html', htmlDecoded);

  // Update the container's HTML
  container.innerHTML = htmlDecoded.replace(
    textToHighlight,
    `<span style="${highlightStyle}">${textToHighlight}</span>`
  );
}
