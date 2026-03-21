import { createPostLib } from './db';

const lib = createPostLib('disclosures');

export const getDisclosures = lib.getAll;
export const searchDisclosures = lib.search;
export const getDisclosureById = lib.getById;
export const getPrevNext = lib.getPrevNext;

export const getDisclosuresPage = ({ page, itemsPerPage } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchDisclosuresPage = ({ query, page, itemsPerPage } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
