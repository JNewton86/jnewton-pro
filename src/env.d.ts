// Request-scoped values set by src/middleware.ts for the client portal.
declare namespace App {
  interface Locals {
    /** The client whose portal this request is for (set under /clients/<slug>/ and its API). */
    client?: import('./data/clients').ClientPortal;
    /** True once the passcode session has been verified for this request. */
    authenticated?: boolean;
  }
}
