import { createPostLib } from './db';

const lib = createPostLib('archive');

export const getArchives = lib.getAll;
export const searchArchives = lib.search;
export const getArchiveById = lib.getById;
export const getPrevNext = lib.getPrevNext;

export const getArchivesPage = ({ page, itemsPerPage } = {}) =>
  lib.getPage({ page, itemsPerPage });

export const searchArchivesPage = ({ query, page, itemsPerPage } = {}) =>
  lib.searchPage({ query, page, itemsPerPage });
