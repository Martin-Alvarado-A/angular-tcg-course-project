import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
export class LoggingService {
  lastLog: string;

  constructor() {}

  printLog(message: string) {
    console.log(`🔎 | LoggingService | printLog > message:`, message);
    console.log(`🔎 | LoggingService | printLog > lastLog:`, this.lastLog);
    this.lastLog = message;
  }
}
