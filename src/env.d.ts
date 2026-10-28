// Request-scoped values set by src/middleware.ts for the client portal.
declare namespace App {
  interface Locals {
    /** The signed-in client, read from the session cookie by the middleware for /portal/ and its API. */
    client?: import('./data/clients').ClientPortal;
  }
}
