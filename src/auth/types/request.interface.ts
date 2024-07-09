import { JwtPayload } from '../strategies/jwt-payload';

declare module 'express' {
  interface Request {
    user?: JwtPayload; // oder JwtPayloadWithRt, falls dies die korrekte Typdefinition ist
    cookies?: { [key: string]: string }; // Fügt die `cookies`-Eigenschaft hinzu
  }
}
