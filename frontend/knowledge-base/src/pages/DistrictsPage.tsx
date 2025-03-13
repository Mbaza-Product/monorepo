import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';

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
} from '@/redux/features/districtsSlice';
import { onGetItems as onGetProvinces } from '@/redux/features/provincesSlice';
import DataLoader from '@/components/shared/skeleton/DataLoader';
import { IDistrict } from '@/types/district.type';
import RightSidePopup from '@/components/shared/menu/RightSidePopup';
import CloseIcon from '@/components/shared/icons/CloseIcon';

const DistrictPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [popupType, setPopupType] = useState<'add' | 'edit' | null>(
    null,
  );
  const [current, setCurrent] = useState<Partial<IDistrict> | null>(
    null,
  );
  const { districts, loading, error } = useAppSelector(
    state => state.districts,
  );

  const { provinces } = useAppSelector(state => state.provinces);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(onGetItems());
  }, []);

  useEffect(() => {
    if (!provinces.length) {
      dispatch(onGetProvinces());
    }
  }, [provinces]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!current?.name || !current?.provinceId) {
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
        <h1 className="text-2xl font-semibold mb-4">All districts</h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3">
          {provinces.length ? (
            <button
              type="button"
              onClick={() => {
                setCurrent(null);
                setPopupType('add');
              }}
              className="whitespace-nowrap bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 lg:py-2 px-2 lg:px-4 rounded"
            >
              Add district
            </button>
          ) : null}
        </div>
      </div>

      <DataLayout
        loader={<DataLoader count={6} />}
        isLoading={loading && !districts.length}
      >
        <div className="w-full flex flex-col overflow-x-auto">
          <table className="whitespace-nowrap w-full table-auto dark:text-white">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="hidden px-4 py-2 text-left">URL</th>
                <th className="hidden px-4 py-2 text-left">Login</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {districts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    No data
                  </td>
                </tr>
              ) : null}
              {districts.map((item, index) => (
                <tr
                  key={item.id}
                  className={
                    index % 2 === 0
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                  }
                >
                  <td className="px-4 py-2">{index + 1}.</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2 hidden">
                    {item.zammadUrl}
                  </td>
                  <td className="px-4 py-2 hidden">
                    {item.zammadLogin}
                  </td>
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
              {popupType === 'edit' ? 'Edit' : 'Add'} district
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-3 mt-4"
            >
              <select
                id="provinces"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                value={current?.provinceId}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      provinceId: Number(e.target.value),
                    });
                  } else {
                    setCurrent({
                      provinceId: Number(e.target.value),
                    });
                  }
                }}
              >
                <option>Select province...</option>
                {provinces.map(item => (
                  <option
                    value={item.id}
                    key={`${item.id}_${item.nameEn}`}
                  >
                    {item.nameEn}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={current?.name}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      name: e.target.value,
                    });
                  } else {
                    setCurrent({
                      name: e.target.value,
                    });
                  }
                }}
                placeholder="Name"
                title="Name"
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />
              <input
                type="url"
                value={current?.zammadUrl}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      zammadUrl: e.target.value,
                    });
                  } else {
                    setCurrent({
                      zammadUrl: e.target.value,
                    });
                  }
                }}
                placeholder="Zammad URL"
                title="Zammad URL"
                className="hidden flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />

              <input
                type="text"
                value={current?.zammadLogin}
                onChange={e => {
                  if (current) {
                    setCurrent({
                      ...current,
                      zammadLogin: e.target.value,
                    });
                  } else {
                    setCurrent({
                      zammadLogin: e.target.value,
                    });
                  }
                }}
                placeholder="Zammad Login"
                title="Zammad Login"
                className="hidden flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />

              <div className="hidden relative">
                <button
                  type="button"
                  className="absolute right-0 top-0 bottom-0 px-4 py-1.5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff size={24} />
                  ) : (
                    <FiEye size={24} />
                  )}
                </button>
                <input
                  type={!showPassword ? 'password' : 'text'}
                  value={current?.zammadPassword}
                  onChange={e => {
                    if (current) {
                      setCurrent({
                        ...current,
                        zammadPassword: e.target.value,
                      });
                    } else {
                      setCurrent({
                        zammadPassword: e.target.value,
                      });
                    }
                  }}
                  placeholder="Zammad Password"
                  title="Zammad Password"
                  className="w-full dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4 pr-12"
                />
              </div>
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

export default DistrictPage;
