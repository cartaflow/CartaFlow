export class NotFoundError extends Error {
  readonly code = "notFound";
  readonly resource: string;
  constructor(resource = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.resource = resource;
    console.error(this);
  }
}

export class ForbiddenError extends Error {
  readonly code = "forbidden";
  readonly resource: string;
  constructor(resource = "Resource") {
    super(`${resource} access denied`);
    this.name = "ForbiddenError";
    this.resource = resource;
    console.error(this);
  }
}

export class UnauthenticatedError extends Error {
  readonly code = "unauthenticated";
  constructor(reason?: string) {
    super(reason ? `User not authenticated: ${reason}` : "User not authenticated");
    this.name = "UnauthenticatedError";
    console.error(this);
  }
}
