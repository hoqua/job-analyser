const siteToSelectorMap = {
  'www.linkedin.com':
    '#job-details',
};

chrome.runtime.onMessage.addListener(main);

function main(request, sender, sendResponse) {
  console.log('in content');

  if (request.type === 'get_job_description') {
    const text = document.querySelector(
      '#job-details'
    )?.textContent;

    sendResponse(text);
  }

  if (request.type === 'highlight_text') {
    console.log('content highlight_text request', request);
    for (const discrepancy of request.content.discrepancies) {
      console.log('discrepancy', discrepancy);

      highlightText(discrepancy, 'background-color: yellow');
    }

    for (const weirdThing of request.content.weirdThings) {
      console.log('weirdThing', weirdThing);
      highlightText(weirdThing, 'background-color: red');
    }
    sendResponse(undefined);
  }
}

function highlightText(textToHighlight, highlightStyle) {
  // Select the container
  const container = document.querySelector(
    '#job-details'
  );
  const  allElements = container.querySelectorAll("*")
  const  result = Array.from(allElements).find(v => v.textContent === textToHighlight);
  if (!result) return;

  // Get the HTML of the container
  const html = result.innerHTML;

  // Update the container's HTML
  result.innerHTML = html.replace(
    textToHighlight,
    `<span style="${highlightStyle}">${textToHighlight}</span>`
  );
}
