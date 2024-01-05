import React, { useEffect, useState } from 'react';
import SetApiKey from './components/set-api-key';
import SetCv from './components/set-cv';
import JobAnalyzer from './components/job-analyzer';

// @ts-ignore
import { API_KEY, CV_KEY } from '../Background/const';

export default function Popup() {
  const [apiKey, setApiKey] = useState('');
  const [cv, setCv] = useState('');

  useEffect(() => {
    chrome.storage.local.get([API_KEY], (res) => setApiKey(res[API_KEY]));
    chrome.storage.local.get([CV_KEY], (res) => setCv(res[CV_KEY]));
  }, []);

  async function persistApiKey(apiKey: string) {
    await chrome.storage.local.set({ [API_KEY]: apiKey });
    setApiKey(apiKey);
  }

  async function persistCv(cv: string) {
    await chrome.storage.local.set({ [CV_KEY]: cv });
    setCv(cv);
  }

  const shouldSetApiKey = !apiKey;
  const shouldSetCv = apiKey && !cv;
  const shouldAnalyzePage = apiKey && cv;

  return (
    <div className="card min-w-[600px] min-h-[600px] shadow-xl">
      <div className="card-body flex justify-center items-center">
        {/*{shouldSetApiKey && <SetApiKey onSubmit={persistApiKey}/>}*/}
        {/*{shouldSetCv && <SetCv onSubmit={persistCv}/>}*/}
        {/*{shouldAnalyzePage && <JobAnalyzer/>}*/}
        <JobAnalyzer />
      </div>
    </div>
  );
}
