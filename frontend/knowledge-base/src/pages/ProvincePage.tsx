import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import {
  useAppDispatch,
  useAppSelector,
} from '@/components/hooks/useRedux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataLayout from '@/components/layouts/DataLayout';
import {
  onAddItem,
  onDeleteItem,
  onEditItem,
  onGetItems,
} from '@/redux/features/provincesSlice';
import DataLoader from '@/components/shared/skeleton/DataLoader';
import { IProvince } from '@/types/province.type';
import RightSidePopup from '@/components/shared/menu/RightSidePopup';
import CloseIcon from '@/components/shared/icons/CloseIcon';

const ProvincePage = () => {
  const [popupType, setPopupType] = useState<'add' | 'edit' | null>(
    null,
  );
  const [current, setCurrent] = useState<Partial<IProvince> | null>(
    null,
  );
  const { provinces, loading, error } = useAppSelector(
    state => state.provinces,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(onGetItems());
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!current?.nameEn || !current?.nameRw || !current?.nameFr) {
      toast.error('Please enter all fields');
      return;
    }

    if (current.id && popupType === 'edit') {
      await dispatch(onEditItem(current));
    } else {
      await dispatch(onAddItem(current));
    }

    setCurrent(null);
    setPopupType(null);
  };

  const handleDelete = async () => {
    if (!current?.id) {
      return;
    }
    await dispatch(onDeleteItem(current.id));

    setCurrent(null);
    setPopupType(null);
  };
  return (
    <DashboardLayout>
      <div className="flex flex-wrap mb-4 gap-2 justify-between">
        <h1 className="text-2xl font-semibold mb-4">All provinces</h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3">
          {provinces.length < 5 ? (
            <button
              type="button"
              onClick={() => {
                setCurrent(null);
                setPopupType('add');
              }}
              className="whitespace-nowrap bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 lg:py-2 px-2 lg:px-4 rounded"
            >
              Add Province
            </button>
          ) : null}
        </div>
      </div>

      <DataLayout
        loader={<DataLoader count={6} />}
        isLoading={loading && !provinces.length}
      >
        <div className="w-full flex flex-col overflow-x-auto">
          <table className="whitespace-nowrap w-full table-auto dark:text-white">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">English Name</th>
                <th className="px-4 py-2 text-left">Kinya Name</th>
                <th className="px-4 py-2 text-left">French Name</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {provinces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No data found
                  </td>
                </tr>
              ) : null}
              {provinces.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    index % 2 === 0
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                  }
                >
                  <td className="px-4 py-2">{index + 1}.</td>
                  <td className="px-4 py-2">{item.nameEn}</td>
                  <td className="px-4 py-2">{item.nameRw}</td>
                  <td className="px-4 py-2">{item.nameFr}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrent(item);
                        setPopupType('edit');
                      }}
                      className="text-blue-500 dark:text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataLayout>

      {popupType ? (
        <RightSidePopup>
          <div className="flex flex-col relative">
            <button
              type="button"
              className="absolute top-0 right-0"
              onClick={() => {
                setCurrent(null);
                setPopupType(null);
              }}
            >
              <CloseIcon />
            </button>
            <h2 className="font-semibold text-lg">
              {popupType === 'edit' ? 'Edit' : 'Add'} Province
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-3 mt-4"
            >
              <input
                type="text"
                value={current?.nameEn}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      nameEn: e.target.value,
                    });
                  } else {
                    setCurrent({
                      nameEn: e.target.value,
                    });
                  }
                }}
                placeholder="English Name"
                title="English Name"
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />
              <input
                type="text"
                value={current?.nameRw}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      nameRw: e.target.value,
                    });
                  } else {
                    setCurrent({
                      nameRw: e.target.value,
                    });
                  }
                }}
                placeholder="Kinya Name"
                title="Kinya Name"
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />

              <input
                type="text"
                value={current?.nameFr}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      nameFr: e.target.value,
                    });
                  } else {
                    setCurrent({
                      nameFr: e.target.value,
                    });
                  }
                }}
                placeholder="French Name"
                title="French Name"
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />
              <div className="flex items-center space-x-4 pt-6">
                {popupType === 'edit' ? (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleDelete}
                    className="ml-auto bg-red-500 text-white py-2 px-4 rounded-md disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto bg-blue-500 text-white py-2 px-4 rounded-md disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </RightSidePopup>
      ) : null}
    </DashboardLayout>
  );
};

export default ProvincePage;
