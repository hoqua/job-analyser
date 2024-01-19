const domPurify = require('dompurify');
const siteToQuerySelectorMap = {
  'www.linkedin.com': '#job-details',
  'www.indeed.com': '#jobDescriptionText',
};

chrome.runtime.onMessage.addListener(main);

function main(request, sender, sendResponse) {
  console.log('in content', request);

  const currentUrl = request.content.url.split('/')[2];

  if (request.type === 'get_job_description') {
    const htmlString = document.querySelector(
      siteToQuerySelectorMap[currentUrl]
    )?.innerHTML;

    console.log('htmlString', htmlString);
    const text = domPurify.sanitize(htmlString);
    console.log('text', text.toString());
    sendResponse(text);
  }

  if (request.type === 'highlight_text') {
    const container = document.querySelector(
      siteToQuerySelectorMap[currentUrl]
    );
    if (!container) return;
    console.log('content highlight_text request', request);

    //Highlight discrepancies and weird things
    if (request.content.discrepancies) {
      for (const discrepancy of request.content.discrepancies) {
        console.log('discrepancy', discrepancy);

        highlightText(discrepancy, container, 'background-color: yellow');
      }
    }

    if (request.content.weirdThing) {
      for (const weirdThing of request.content.weirdThings) {
        console.log('weirdThing', weirdThing);
        highlightText(weirdThing, container, 'background-color: red');
      }
    }

    if (request.content.companyProfile) {
      for (const companyProfile of request.content.companyProfile) {
        console.log('companyProfile', companyProfile);
        highlightText(companyProfile, container, 'background-color: green');
      }
    }

    sendResponse(undefined);
  }
}

function highlightText(textToHighlight, container, highlightStyle) {
  // Create a new DOMParser instance
  const parser = new DOMParser();

  // Sanitize the innerHTML of the container
  const decodedHTML = domPurify.sanitize(container.innerHTML);

  // Parse the sanitized HTML string into a document object
  const doc = parser.parseFromString(decodedHTML, 'text/html');

  // Loop through all the nodes in the document
  for (const node of [...doc.body.querySelectorAll('*')]) {
    if (
      node.outerHTML.toLowerCase().trim() ===
      textToHighlight.toLowerCase().trim()
    ) {
      const div = document.createElement('div');
      div.style = highlightStyle;
      const clonedNode = node.cloneNode(true);
      div.appendChild(clonedNode);
      node.replaceWith(div);
    }
  }

  // Update the innerHTML of the container with the modified HTML
  container.innerHTML = doc.body.innerHTML;
}

module.exports = {
  highlightText,
};
