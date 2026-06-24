import { type ChangeEvent, type FC } from 'react';
import {
  PaginationInfo,
  PaginationRoot,
  StyledPagination,
} from './styles';

type PaginationControlsProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  withTopBorder?: boolean;
};

export const PaginationControls: FC<PaginationControlsProps> = ({
                                                                  page,
                                                                  pageCount,
                                                                  pageSize,
                                                                  totalItems,
                                                                  onPageChange,
                                                                  withTopBorder = false,
                                                                }) => {
  if (pageCount <= 1) {
    return null;
  }

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  const handleChangePage = (_: ChangeEvent<unknown>, value: number): void => {
    onPageChange(value);
  };

  return (
    <PaginationRoot withTopBorder={withTopBorder}>
      <PaginationInfo>
        Showing {startItem}-{endItem} of {totalItems}
      </PaginationInfo>

      <StyledPagination
        color="primary"
        count={pageCount}
        onChange={handleChangePage}
        page={page}
        shape="rounded"
        size="small"
      />
    </PaginationRoot>
  );
};