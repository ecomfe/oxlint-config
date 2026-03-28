// rule: typescript/consistent-type-definitions ["error", "interface"]
// expect: typescript-eslint(consistent-type-definitions)
// Use 'interface' instead of 'type' for object type definitions
type UserProfile = {
    id: number;
    name: string;
    email: string;
};

export type { UserProfile };
