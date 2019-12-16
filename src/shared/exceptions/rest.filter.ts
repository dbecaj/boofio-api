import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, InternalServerErrorException, Next } from "@nestjs/common";
import { BadRequestException, InternalServerException } from "./rest.exception";
import { Logger } from "../logger";
import { MongoError } from "mongodb";

@Catch(BadRequestException, InternalServerException)
export class RestExceptionFilter implements ExceptionFilter<BadRequestException | InternalServerException> {

  public catch(exception: BadRequestException | InternalServerException, host: ArgumentsHost): void {
    if (exception instanceof InternalServerException) Logger.error(exception);

    const res = host.switchToHttp().getResponse();
    res.status(exception.httpStatus).send({
      code: exception.code,
      message: exception.message,
      error: exception.error,
      errors: exception.errors,
      data: exception.data,
    });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  
  public catch(exception: HttpException, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse();
    res.status(exception.getStatus()).send(exception.getResponse());
  }
}

// Any non defined exceptions will be handled here
@Catch()
export class GeneralExceptionFilter implements ExceptionFilter<Error> {

    public catch(exception: HttpException, host: ArgumentsHost): void {
        Logger.error(exception);
        const res = host.switchToHttp().getResponse();

        // Send generic internal server error when we are in production
        if (process.env.NODE_ENV === 'production') {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                status: 500,
                message: {
                    statusCode: 500,
                    error: "Internal Server Error"
                }
            });
            return;
        }

        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(exception);
    }
}