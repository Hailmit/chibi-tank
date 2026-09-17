import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { runCoreTests } from './core-suite.js';
for(const result of runCoreTests())test(result.name,()=>assert.ok(result.pass,result.error));
