import { QueryFailedError } from "typeorm";
import { Responses } from "./Responses";
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
        constructor(errorOrMessage?: any) {
            if (errorOrMessage instanceof QueryFailedError) {
                switch (errorOrMessage.driverError.code) {
                    case "ER_DUP_ENTRY":
                        super("Item already Exists");
                        break;
                    default:
                        super(errorOrMessage.driverError.code);
                }
            } else {
                super(errorOrMessage);
            }
        }
        override respond(res: Response<any, Record<string, any>>): void {
            Responses.InternalServerError(res, this.message);
        }
    }
}
