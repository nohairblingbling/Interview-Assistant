import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  setConfig: (config: any) => ipcRenderer.invoke('set-config', config),
  testAPIConfig: (config: any) => ipcRenderer.invoke('test-api-config', config),
  parsePDF: (buffer: ArrayBuffer) => ipcRenderer.invoke('parsePDF', buffer),
  processImage: (path: string) => ipcRenderer.invoke('process-image', path),
  highlightCode: (code: string, language: string) => ipcRenderer.invoke('highlight-code', code, language),
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => {
      ipcRenderer.on(channel, listener);
      return () => ipcRenderer.removeListener(channel, listener);
    },
    removeListener: (channel: string, listener: (event: any, ...args: any[]) => void) => ipcRenderer.removeListener(channel, listener),
  },
  callOpenAI: (params: any) => ipcRenderer.invoke('callOpenAI', params),
  loadAudioProcessor: (): Promise<string> => ipcRenderer.invoke('load-audio-processor'),
  getSystemAudioStream: () => ipcRenderer.invoke('get-system-audio-stream'),
  transcribeAudioFile: (filePath: string, config: any) => ipcRenderer.invoke('transcribe-audio-file', filePath, config),
  saveTempAudioFile: (audioBuffer: ArrayBuffer) => ipcRenderer.invoke('save-temp-audio-file', audioBuffer),
  transcribeAudio: (audioBuffer: ArrayBuffer, config: any) => ipcRenderer.invoke('transcribe-audio', audioBuffer, config),
});
