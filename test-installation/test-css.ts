// Test CSS import with TypeScript
import * as fs from 'fs';
import * as path from 'path';

console.log('Testing CSS styles with TypeScript...');

try {
  const stylesPath = path.join(
    __dirname,
    'node_modules',
    '@vegaci_shared',
    'vsplit-payment-gateway',
    'dist',
    'styles.css'
  );
  const stylesExist: boolean = fs.existsSync(stylesPath);

  if (stylesExist) {
    const stylesContent: string = fs.readFileSync(stylesPath, 'utf8');
    console.log('✅ CSS file exists and is accessible');
    console.log(`CSS file size: ${stylesContent.length} characters`);
    console.log(
      'CSS contains VSplit classes:',
      stylesContent.includes('vsplit')
    );

    // Test that we can parse some CSS properties
    const hasMediaQueries: boolean = stylesContent.includes('@media');
    const hasCustomProperties: boolean = stylesContent.includes('--');

    console.log('✅ CSS structure analysis:');
    console.log(`  - Contains media queries: ${hasMediaQueries}`);
    console.log(`  - Contains custom properties: ${hasCustomProperties}`);
  } else {
    console.log('❌ CSS file not found');
  }
} catch (error) {
  console.error('❌ Error testing CSS:', (error as Error).message);
}
