import { createParamDecorator } from '@nestjs/common';
import { IsNumberString } from 'class-validator';
import * as mongoose from 'mongoose';

export class VPagination {
    @IsNumberString()
    page: number;

    @IsNumberString()
    perPage: number;

    /**
        Sets query skip and limit to the values in pagination
        @param Query object to apply pagination to
    */
    applyTo(query: mongoose.DocumentQuery<any, any, any> | mongoose.Aggregate<any[]>) {
        // If page or perPage is negative/zero set the offender to 0 or DEFAULT_PAGE respectively
        this.page = +(this.page > 0 ? this.page : 0);
        this.perPage = +(this.perPage > 0 ? this.perPage : process.env.DEFAULT_PAGE_SIZE)

        query.skip(this.perPage * this.page);
        query.limit(this.perPage);

        return query;
    }
}

export const Pagination = createParamDecorator(
    (data, req) => {
        const p = new VPagination();
        p.page = req.query.page;
        p.perPage = req.query.perPage;

        return p;
    }
)