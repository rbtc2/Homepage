import { createPostLib } from './db';

const lib = createPostLib('disclosures');

export const getDisclosures = lib.getAll;
export const searchDisclosures = lib.search;
export const getDisclosureById = lib.getById;
export const getPrevNext = lib.getPrevNext;
