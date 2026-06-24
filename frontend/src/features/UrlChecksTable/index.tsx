import type { FC } from 'react';
import type { UrlCheck, UrlCheckStatus } from '@/types';
import {
  formatDurationMs,
  formatOptionalDateTime,
  getUrlCheckStatusLabel,
} from '@/utils';
import {
  ErrorText,
  MutedText,
  Table,
  TableBody,
  TableHead,
  TableRoot,
  UrlCell,
  UrlStatusChip,
} from './styles';

type StatusChipColor = 'default' | 'primary' | 'success' | 'error' | 'warning';

const getStatusColor = (status: UrlCheckStatus): StatusChipColor => {
  if (status === 'success') {
    return 'success';
  }

  if (status === 'error') {
    return 'error';
  }

  if (status === 'cancelled') {
    return 'warning';
  }

  if (status === 'in_progress') {
    return 'primary';
  }

  return 'default';
};

type UrlChecksTableProps = {
  urls: UrlCheck[];
};

export const UrlChecksTable: FC<UrlChecksTableProps> = ({ urls }) => (
  <TableRoot>
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
        {urls.map((urlCheck) => (
          <tr key={urlCheck.id}>
            <td>
              <UrlCell>{urlCheck.url}</UrlCell>
            </td>

            <td>
              <UrlStatusChip
                color={getStatusColor(urlCheck.status)}
                label={getUrlCheckStatusLabel(urlCheck.status)}
                size="small"
              />
            </td>

            <td>
              {urlCheck.httpStatus ?? <MutedText>-</MutedText>}
            </td>

            <td>
              {urlCheck.error ? (
                <ErrorText>{urlCheck.error}</ErrorText>
              ) : (
                <MutedText>-</MutedText>
              )}
            </td>

            <td>{formatOptionalDateTime(urlCheck.startedAt)}</td>
            <td>{formatOptionalDateTime(urlCheck.finishedAt)}</td>
            <td>{formatDurationMs(urlCheck.durationMs)}</td>
          </tr>
        ))}
      </TableBody>
    </Table>
  </TableRoot>
);