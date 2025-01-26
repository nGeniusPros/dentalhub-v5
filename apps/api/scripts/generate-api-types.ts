import { generate } from 'openapi-typescript-codegen';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateApiTypes() {
  try {
    await generate({
      input: path.join(__dirname, '../src/openapi/openapi.yaml'),
      output: path.join(__dirname, '../src/types/generated'),
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
      indent: '  ',
      postfixModels: 'Type',
      postfixServices: 'Service',
      useUnionTypes: true,
    });

    console.log('✅ Successfully generated API types');
  } catch (error) {
    console.error('❌ Error generating API types:', error);
    process.exit(1);
  }
}

generateApiTypes();
