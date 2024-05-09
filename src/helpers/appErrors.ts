import { Responses } from "./responses";
import { type Response } from "express";

export namespace AppErrors {
    export abstract class WithResponse extends Error {
        constructor(message?: string) {
            super(message);
        }
        public abstract respond(res: Response): void;
    }

    export class AlreadyDeleted extends WithResponse {
        override respond(res: Response<any, Record<string, any>>): void {
            Responses.AlreadyDeleted(res);
        }
    }

    export class BadCredentials extends WithResponse {
        override respond(res: Response<any, Record<string, any>>): void {
            Responses.BadCredentials(res);
        }
    }

    export class AlreadyExists extends WithResponse {
        override respond(res: Response<any, Record<string, any>>): void {
            Responses.AlreadyExists(res, this.message);
        }
    }

    export class NotFound extends WithResponse {
        override respond(res: Response<any, Record<string, any>>): void {
            Responses.NotFound(res, this.message);
        }
    }

    export class InternalError extends WithResponse {
        override respond(res: Response<any, Record<string, any>>): void {
            Responses.InternalServerError(res, this.message);
        }
    }
}
