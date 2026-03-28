// rule: typescript/consistent-type-imports (error in strict mode)
// expect: typescript-eslint(consistent-type-imports)
// In strict mode, type-only imports must use 'import type'
import { UserProfile } from './types';

export function greet(user: UserProfile): string {
    return `Hello, ${user.name}`;
}
