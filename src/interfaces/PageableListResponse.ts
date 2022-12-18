interface IPageableListResponse {
  content: any;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  offset: number;
  pageNumber: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}

export default IPageableListResponse;
