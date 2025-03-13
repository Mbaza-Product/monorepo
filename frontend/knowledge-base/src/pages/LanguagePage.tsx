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
  onGetLanguages,
} from '@/redux/features/languagesSlice';
import DataLoader from '@/components/shared/skeleton/DataLoader';
import { ILanguage } from '@/types/language.type';
import RightSidePopup from '@/components/shared/menu/RightSidePopup';
import CloseIcon from '@/components/shared/icons/CloseIcon';
import { languageCodes } from '@/utils/appConstants/language';

const LanguagePage = () => {
  const [popupType, setPopupType] = useState<'add' | 'edit' | null>(
    null,
  );
  const [current, setCurrent] = useState<Partial<ILanguage> | null>(
    null,
  );
  const { languages, loading, error } = useAppSelector(
    state => state.languages,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(onGetLanguages());
  }, []);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!current?.name) {
      toast.error('Please enter name');
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

  const languageOptions = languageCodes.filter(item => {
    const isExist = languages.find(
      language => language.code === item.code,
    );
    return !isExist;
  });
  return (
    <DashboardLayout>
      <div className="flex flex-wrap mb-4 gap-2 justify-between">
        <h1 className="text-2xl font-semibold mb-4">All languages</h1>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3">
          {languages.length < 3 ? (
            <button
              type="button"
              onClick={() => {
                setCurrent(null);
                setPopupType('add');
                if (languageOptions.length === 0) {
                  toast.error('No more language to add');
                } else {
                  setCurrent({
                    code: languageOptions[0].code as any,
                  });
                }
              }}
              className="whitespace-nowrap bg-green-500 hover:bg-green-600 text-white text-xs font-medium py-1 lg:py-2 px-2 lg:px-4 rounded"
            >
              Add Language
            </button>
          ) : null}
        </div>
      </div>

      <DataLayout
        loader={<DataLoader count={6} />}
        isLoading={loading && !languages.length}
      >
        <div className="w-full flex flex-col overflow-x-auto">
          <table className="whitespace-nowrap w-full table-auto dark:text-white">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Language code</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {languages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    No data
                  </td>
                </tr>
              ) : null}
              {languages.map((language, index) => (
                <tr
                  key={language.id}
                  className={
                    index % 2 === 0
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                  }
                >
                  <td className="px-4 py-2">{index + 1}.</td>
                  <td className="px-4 py-2">{language.name}</td>
                  <td className="px-4 py-2">{language.code}</td>
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrent(language);
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
              {popupType === 'edit' ? 'Edit' : 'Add'} Language
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col space-y-3 mt-4"
            >
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
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />
              {popupType === 'add' ? (
                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={current?.code}
                  onChange={e => {
                    if (current) {
                      setCurrent({
                        ...current,
                        code: e.target.value as any,
                      });
                    } else {
                      setCurrent({
                        code: e.target.value as any,
                      });
                    }
                  }}
                >
                  {languageOptions.map(item => (
                    <option value={item.code}>
                      {item.code}({item.name})
                    </option>
                  ))}
                </select>
              ) : null}
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

export default LanguagePage;
