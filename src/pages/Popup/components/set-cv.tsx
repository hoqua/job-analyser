import React, { useState } from 'react';

type Props = {
  onSubmit: (cv: string) => void;
};

export default function SetCv({ onSubmit }: Props) {
  const [cv, setCv] = useState('');

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCv(e.target.value);
  }

  async function handleSubmit() {
    onSubmit(cv);
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Give me your CV text to match your dream job!</h1>
      <textarea
        placeholder="Bio"
        className="textarea textarea-bordered textarea-lg"
        onChange={handleOnChange}
      />

      <button
        className={'btn join-item'}
        disabled={!cv.length}
        onClick={handleSubmit}
      >
        Submit
      </button>
    </div>
  );
}
