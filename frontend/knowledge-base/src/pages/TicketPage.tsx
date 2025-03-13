import { useEffect, useState } from 'react';

import {
  useAppDispatch,
  useAppSelector,
} from '@/components/hooks/useRedux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataLayout from '@/components/layouts/DataLayout';
import { onGetTickets } from '@/redux/features/ticketsSlice';
import DataLoader from '@/components/shared/skeleton/DataLoader';
import API from '@/services/api/api';
import { formatDate } from '@/utils/helpers';

const TicketPage = () => {
  const { tickets, loading, error } = useAppSelector(
    state => state.tickets,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(onGetTickets());
  }, []);

  const downloadCsv = () => {
    fetch(`${API}/api/tickets/download`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tickets.csv');
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      });
  };
  return (
    <DashboardLayout>
      <div className="flex flex-wrap mb-4 gap-2 justify-between">
        <h1 className="text-2xl font-semibold mb-4">All Tickets</h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3">
          {tickets.length > 0 && (
            <button
              type="button"
              onClick={downloadCsv}
              className="whitespace-nowrap bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 lg:py-2 px-2 lg:px-4 rounded"
            >
              Export
            </button>
          )}
        </div>
      </div>

      <DataLayout
        loader={<DataLoader count={6} />}
        isLoading={loading && !tickets.length}
      >
        <div className="w-full flex flex-col overflow-x-auto">
          <table className="w-full whitespace-nowrap table-auto dark:text-white">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Complaint</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center">
                    No data
                  </td>
                </tr>
              )}
              {tickets.map((ticket, index) => (
                <tr
                  key={ticket.id}
                  className={
                    index % 2 === 0
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                  }
                >
                  <td className="px-4 py-2">{index + 1}.</td>
                  <td className="px-4 py-2">{ticket.phone}</td>
                  <td className="px-4 py-2">{ticket.address}</td>
                  <td className="px-4 py-2">{ticket.complaint}</td>
                  <td className="px-4 py-2">{ticket.category}</td>
                  <td className="px-4 py-2">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataLayout>
    </DashboardLayout>
  );
};

export default TicketPage;
