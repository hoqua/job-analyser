const domPurify = require('dompurify');
const siteToQuerySelectorMap = {
  'www.linkedin.com': '#job-details',
};

chrome.runtime.onMessage.addListener(main);

function main(request, sender, sendResponse) {
  console.log('in content', request);

  if (request.type === 'get_job_description') {
    const htmlString = document.querySelector('#job-details')?.innerHTML;

    console.log('htmlString', htmlString);
    const text = domPurify.sanitize(htmlString);
    console.log('text', text.toString());
    sendResponse(text);
  }

  if (request.type === 'highlight_text') {
    const container = document.querySelector('#job-details');
    if (!container) return;
    console.log('content highlight_text request', request);

    //Append company profile to the top of the job description
    const p = document.createElement('p');
    p.style = 'background-color: green';
    p.innerHTML = request.content.companyProfile;
    container.prepend(p);

    //Highlight discrepancies and weird things
    for (const discrepancy of request.content.discrepancies) {
      console.log('discrepancy', discrepancy);

      highlightText(discrepancy, container, 'background-color: yellow');
    }

    for (const weirdThing of request.content.weirdThings) {
      console.log('weirdThing', weirdThing);
      highlightText(weirdThing, container, 'background-color: red');
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

  // Select all elements in the document whose outerHTML matches textToHighlight
  const textNodes = [...doc.body.querySelectorAll('*')].filter(
    (node) => node.outerHTML.trim() === textToHighlight.trim()
  );

  // For each matching element, create a new div, set its style to highlightStyle,
  // clone the element, append the clone to the div, and replace the element with the div
  textNodes.forEach((textNode) => {
    const div = document.createElement('div');
    div.style = highlightStyle;
    const clonedNode = textNode.cloneNode(true);
    div.appendChild(clonedNode);
    textNode.replaceWith(div);
  });

  // Update the innerHTML of the container with the modified HTML
  container.innerHTML = doc.body.innerHTML;
}

module.exports = {
  highlightText,
};
