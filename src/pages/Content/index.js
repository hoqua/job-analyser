const siteToSelectorMap = {
  'www.linkedin.com':
    '#job-details',
};

chrome.runtime.onMessage.addListener(main);

function main(request, sender, sendResponse) {
  console.log('in content', request);

  if (request.type === 'get_job_description') {
    const text = document.querySelector(
      '#job-details'
    )?.textContent;

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

    for (const whatCompanyActuallyDoes of request.content.whatCompanyActuallyDoes) {
      console.log('weirdThing', whatCompanyActuallyDoes);
      highlightText(whatCompanyActuallyDoes, container, 'background-color: green');
    }
    sendResponse(undefined);
  }
}

function highlightText(textToHighlight, container, highlightStyle) {
  // Get the HTML of the container
  const html = container.innerHTML;

  // Update the container's HTML
  container.innerHTML = html.replace(
    textToHighlight,
    `<span style="${highlightStyle}">${textToHighlight}</span>`
  );
}
