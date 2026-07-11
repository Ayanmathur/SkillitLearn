/**
 * Zod validators index.
 *
 * Each domain (auth, content, quiz, certificate) gets its own
 * validator file. Every API route must validate input with Zod
 * before touching the database (standing rule).
 *
 * Validator files will be added as routes are built in later prompts.
 */

// Re-export validators as they're created
// export * from "./auth";
// export * from "./content";
// export * from "./quiz";
// export * from "./certificate";
