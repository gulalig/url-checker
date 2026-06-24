import { type FC, useMemo, useState } from 'react';
import { PaginationControls } from '@/components';
import {
  FALLBACK_TEXT,
  URL_CHECK_FILTER_COPY,
  URL_CHECK_STATUS_FILTER,
  URL_CHECK_STATUS_FILTER_OPTIONS,
  URLS_PER_PAGE,
} from '@/constants';
import type { UrlCheck, UrlCheckStatus, UrlCheckStatusFilter } from '@/types';
import {
  formatDurationMs,
  formatOptionalDateTime,
  getStatusChipColor,
  getUrlCheckStatusLabel,
} from '@/utils';
import {
  ErrorText,
  FilterChip,
  FilterGroup,
  FilterLabel,
  FilterToolbar,
  MutedText,
  Table,
  TableBody,
  TableEmptyState,
  TableHead,
  TableRoot,
  TableScroll,
  UrlCell,
  UrlStatusChip,
} from './styles';

type UrlChecksTableProps = {
  urls: UrlCheck[];
};

const getFilterLabel = (filter: UrlCheckStatusFilter): string => {
  if (filter === URL_CHECK_STATUS_FILTER.ALL) {
    return URL_CHECK_FILTER_COPY.ALL;
  }

  return getUrlCheckStatusLabel(filter);
};

export const UrlChecksTable: FC<UrlChecksTableProps> = ({ urls }) => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<UrlCheckStatusFilter>(
    URL_CHECK_STATUS_FILTER.ALL,
  );

  const filteredUrls = useMemo(() => {
    if (statusFilter === URL_CHECK_STATUS_FILTER.ALL) {
      return urls;
    }

    return urls.filter((urlCheck) => urlCheck.status === statusFilter);
  }, [statusFilter, urls]);

  const pageCount = Math.max(Math.ceil(filteredUrls.length / URLS_PER_PAGE), 1);
  const safePage = Math.min(page, pageCount);

  const visibleUrls = useMemo(() => {
    const startIndex = (safePage - 1) * URLS_PER_PAGE;

    return filteredUrls.slice(startIndex, startIndex + URLS_PER_PAGE);
  }, [filteredUrls, safePage]);

  const handleStatusFilterChange = (nextFilter: UrlCheckStatusFilter): void => {
    setStatusFilter(nextFilter);
    setPage(1);
  };

  return (
    <TableRoot>
      <FilterToolbar>
        <FilterLabel>{URL_CHECK_FILTER_COPY.LABEL}</FilterLabel>

        <FilterGroup>
          {URL_CHECK_STATUS_FILTER_OPTIONS.map((filter) => (
            <FilterChip
              color={
                filter === URL_CHECK_STATUS_FILTER.ALL
                  ? 'primary'
                  : getStatusChipColor(filter as UrlCheckStatus)
              }
              isActive={statusFilter === filter}
              key={filter}
              label={getFilterLabel(filter)}
              onClick={() => handleStatusFilterChange(filter)}
              size="small"
              variant={statusFilter === filter ? 'filled' : 'outlined'}
            />
          ))}
        </FilterGroup>
      </FilterToolbar>

      {filteredUrls.length === 0 ? (
        <TableEmptyState>{URL_CHECK_FILTER_COPY.EMPTY}</TableEmptyState>
      ) : (
        <>
          <TableScroll>
            <Table>
              <TableHead>
                <tr>
                  <th>URL</th>
                  <th>Status</th>
                  <th>HTTP</th>
                  <th>Error</th>
                  <th>Started</th>
                  <th>Finished</th>
                  <th>Duration</th>
                </tr>
              </TableHead>

              <TableBody>
                {visibleUrls.map((urlCheck) => (
                  <tr key={urlCheck.id}>
                    <td>
                      <UrlCell>{urlCheck.url}</UrlCell>
                    </td>

                    <td>
                      <UrlStatusChip
                        color={getStatusChipColor(urlCheck.status)}
                        label={getUrlCheckStatusLabel(urlCheck.status)}
                        size="small"
                      />
                    </td>

                    <td>
                      {urlCheck.httpStatus ?? (
                        <MutedText>{FALLBACK_TEXT.EMPTY_VALUE}</MutedText>
                      )}
                    </td>

                    <td>
                      {urlCheck.error ? (
                        <ErrorText>{urlCheck.error}</ErrorText>
                      ) : (
                        <MutedText>{FALLBACK_TEXT.EMPTY_VALUE}</MutedText>
                      )}
                    </td>

                    <td>{formatOptionalDateTime(urlCheck.startedAt)}</td>
                    <td>{formatOptionalDateTime(urlCheck.finishedAt)}</td>
                    <td>{formatDurationMs(urlCheck.durationMs)}</td>
                  </tr>
                ))}
              </TableBody>
            </Table>
          </TableScroll>

          <PaginationControls
            onPageChange={setPage}
            page={safePage}
            pageCount={pageCount}
            pageSize={URLS_PER_PAGE}
            totalItems={filteredUrls.length}
            withTopBorder
          />
        </>
      )}
    </TableRoot>
  );
};