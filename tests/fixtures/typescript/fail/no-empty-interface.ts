// rule: typescript/no-empty-interface
// expect: typescript-eslint(no-empty-interface)
// Empty interfaces are not useful
interface EmptyConfig {}

interface AlsoEmpty extends object {}

export type { EmptyConfig, AlsoEmpty };
