import { validateContent } from '@/lib/content';

try {
  validateContent();
  console.log('Content validation passed.');
} catch (error) {
  console.error('Content validation failed.');
  console.error(error);
  process.exit(1);
}
