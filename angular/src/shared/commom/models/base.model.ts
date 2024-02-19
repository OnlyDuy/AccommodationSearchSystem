export interface PaginationParamsModel {
	totalCount?: number | undefined;
	totalPage?: number | undefined;
	sorting?: string | undefined;
	skipCount?: number | undefined;
	pageSize?: number | undefined;
	pageNum?: number | undefined;
	filters?;
	fieldSort?: string;
	sortType?;
}
