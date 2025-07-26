// Master test runner for all TypeScript tests
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  name: string;
  success: boolean;
  output: string;
  error?: string;
}

const tests = [
  { name: 'Basic Package Test', file: 'test-basic.ts' },
  { name: 'TypeScript Integration Test', file: 'test-typescript.ts' },
  { name: 'React Components Test', file: 'test-react.ts' },
  { name: 'CSS Styles Test', file: 'test-css.ts' },
];

async function runTest(testFile: string): Promise<TestResult> {
  try {
    const { stdout, stderr } = await execAsync(`npx ts-node ${testFile}`);
    return {
      name: testFile,
      success: !stderr && !stdout.includes('❌'),
      output: stdout,
      error: stderr,
    };
  } catch (error) {
    return {
      name: testFile,
      success: false,
      output: '',
      error: (error as Error).message,
    };
  }
}

async function runAllTests(): Promise<void> {
  console.log('🧪 Running VSplit Payment Gateway TypeScript Tests...\n');

  const results: TestResult[] = [];

  for (const test of tests) {
    console.log(`\n📋 Running ${test.name}...`);
    console.log('─'.repeat(50));

    const result = await runTest(test.file);
    results.push(result);

    if (result.success) {
      console.log(result.output);
    } else {
      console.log('❌ Test failed:');
      console.log(result.output);
      if (result.error) {
        console.log('Error:', result.error);
      }
    }
  }

  // Summary
  console.log('\n📊 Test Summary');
  console.log('═'.repeat(50));

  const passed = results.filter((r) => r.success).length;
  const total = results.length;

  results.forEach((result) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
  });

  console.log(`\n${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed! Package is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the output above.');
    process.exit(1);
  }
}

runAllTests().catch(console.error);
