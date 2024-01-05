import React, { useState } from 'react';

type Props = {
  onSubmit: (apiKey: string) => void;
};

export default function SetApiKey({ onSubmit }: Props) {
  const [apiKey, setApiKey] = useState('');

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setApiKey(e.target.value);
  }

  async function handleSubmit() {
    onSubmit(apiKey);
  }

  return (
    <div>
      <h1 className="text-xl">Let's get started!</h1>

      <div className="join">
        <div>
          <div>
            <input
              className="input input-bordered join-item"
              placeholder="Insert OpenAI API Key"
              onChange={handleOnChange}
            />
          </div>
        </div>
        <div className="indicator">
          <button
            className={'btn join-item'}
            disabled={!apiKey.length}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
