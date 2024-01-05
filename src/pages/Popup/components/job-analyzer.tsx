import React, { useState } from 'react';

export default function JobAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<{coverLetter: string} | null>(null);

  async function handleClick() {
    setLoading(true);
    setContent(null);
    const result = await chrome.runtime.sendMessage({});
    setLoading(false);
    setContent(result);
  }

  return (
    <div>
      {loading ? (
        <span className="loading loading-spinner loading-lg" />
      ) : (
        <div>
          {content?.coverLetter && (
            <textarea
              placeholder="Bio"
              className="textarea textarea-bordered textarea-lg w-full max-w-xs"
              value={content.coverLetter}
            />
          )}

          <button onClick={handleClick} className="text-xl">
            Analyse!
          </button>
        </div>
      )}
    </div>
  );
}
