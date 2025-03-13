/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'rc-tree/assets/index.css';
import Tree from 'rc-tree';

import {
  useAppDispatch,
  useAppSelector,
} from '@/components/hooks/useRedux';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import DataLayout from '@/components/layouts/DataLayout';
import API from '@/services/api/api';
import RightSidePopup from '@/components/shared/menu/RightSidePopup';
import CloseIcon from '@/components/shared/icons/CloseIcon';
import { onCategories } from '@/redux/features/categoriesSlice';
import { onGetLanguages } from '@/redux/features/languagesSlice';
import {
  findCategoryById,
  formatTreeCategoryData,
} from '@/utils/helpers';
import { ICategory } from '@/types/category.type';

const DashboardPage = () => {
  const [processing, setProcessing] = useState(false);
  const [currentNode, setCurrentNode] = useState<
    Omit<ICategory, 'children'>
  >({
    id: 0,
    name: '',
    parentId: null,
    group: '',
  });
  const [currentLanguageId, setCurrentLanguageId] = useState(0);
  const [popupType, setPopupType] = useState<'add' | 'edit' | null>(
    null,
  );

  const dispatch = useAppDispatch();

  const { categories, loading } = useAppSelector(
    state => state.categories,
  );

  const { languages } = useAppSelector(state => state.languages);

  useEffect(() => {
    if (currentLanguageId > 0) {
      dispatch(onCategories(currentLanguageId));
      setCurrentNode({
        id: 0,
        name: '',
        parentId: null,
        group: '',
      });
      setPopupType(null);
    }
  }, [currentLanguageId]);

  useEffect(() => {
    dispatch(onGetLanguages());
  }, []);

  useEffect(() => {
    if (languages.length > 0) {
      setCurrentLanguageId(languages[0].id);
    }
  }, [languages]);

  const informationTreeData = formatTreeCategoryData(
    categories.filter(item => !item.isTicket),
  );
  const ticketTreeData = formatTreeCategoryData(
    categories.filter(item => !!item.isTicket),
  );

  const onDrop = async ({
    node,
    dragNode,
  }: {
    node: any;
    dragNode: any;
  }) => {
    if (dragNode.key.includes('add')) {
      return;
    }
    const parentId = node.key.split(',')[1];
    const categoryId = dragNode.key.split(',')[0];

    try {
      setProcessing(true);
      await API.put(`/api/categories/${categoryId}`, {
        parentId,
        name: dragNode.title,
      });
      toast.success('Knowledgebase updated successfully');

      dispatch(onCategories(currentLanguageId));
      setPopupType(null);
    } catch (error: any) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSelect = (
    selectedKeys: any,
    { node }: { node: any },
  ) => {
    if (node.key.includes('add')) {
      const parentId = node.key.split(',')[0];
      setPopupType('add');
      setCurrentNode({
        id: 0,
        name: '',
        parentId: Number(parentId),
        isTicket: false,
        group:
          findCategoryById(categories, Number(parentId))?.group || '',
      });
    } else {
      const id = node.key.split(',')[0];
      const parentId = node.key.split(',')[1];
      const name = node.title;
      setCurrentNode({
        id,
        name,
        parentId: Number(parentId),
        isTicket: false,
        group: findCategoryById(categories, Number(id))?.group || '',
      });
      setPopupType('edit');
    }
  };

  const handleSaveCategory = async (event: any) => {
    event.preventDefault();
    const { id, name, parentId, isTicket, group } = currentNode;
    if (!name.trim()) {
      toast.error('Please enter name');
      return;
    }

    if (parentId && !group.trim()) {
      toast.error('Please enter group');
      return;
    }
    const params: Record<string, any> = {
      name,
      languageId: currentLanguageId,
      ticket: isTicket,
      group,
    };

    if (parentId) {
      params.parentId = parentId;
    }

    try {
      setProcessing(true);
      if (id > 0) {
        await API.put(`/api/categories/${id}`, params);
        toast.success('Knowledgebase updated successfully');
      } else {
        await API.post('/api/categories', params);
        toast.success('Knowledgebase added successfully');
      }

      dispatch(onCategories(currentLanguageId));
      setPopupType(null);
      setCurrentNode({
        id: 0,
        name: '',
        parentId: null,
        group: '',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteCategory = async () => {
    const { id } = currentNode;
    if (!id) {
      toast.error('Please select category');
      return;
    }

    try {
      setProcessing(true);
      await API.delete(`/api/categories/${id}`);
      toast.success('Knowledgebase deleted successfully');
      dispatch(onCategories(currentLanguageId));
      setPopupType(null);
      setCurrentNode({
        id: 0,
        name: '',
        parentId: null,
        group: '',
      });
    } catch (error: any) {
      const message = error?.response?.data?.message;
      toast.error(message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <DashboardLayout>
      <DataLayout isLoading={loading && !categories.length}>
        <h1 className="text-2xl font-semibold">Welcome back</h1>

        <div className="flex flex-wrap items-center gap-3 my-4 md:my-6">
          <button
            type="button"
            onClick={() => {
              setPopupType('add');
              setCurrentNode({
                id: 0,
                name: '',
                parentId: null,
                isTicket: true,
                group: '',
              });
            }}
            className="whitespace-nowrap bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-1 lg:py-2 px-2 lg:px-4 rounded"
          >
            Add USSD Knowledgebase
          </button>

          <div className="flex items-center space-x-2">
            <p>Language: </p>
            <select
              className="border border-gray-300 dark:bg-slate-800 rounded px-2 py-1"
              value={currentLanguageId}
              onChange={e => {
                setCurrentLanguageId(Number(e.target.value));
              }}
            >
              {languages.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5 w-full">
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg pb-1 mb-3 border-b border-gray-300 dark:border-200">
              USSD Tickets
            </h2>
            {ticketTreeData.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No USSD tickets found
              </p>
            ) : null}
            <Tree
              defaultExpandAll={false}
              treeData={ticketTreeData}
              draggable
              onDrop={onDrop}
              // allowDrop={allowDrop}
              onSelect={handleSelect}
            />
          </div>

          <div className="flex flex-col">
            <h2 className="font-semibold text-lg pb-1 mb-3 border-b border-gray-300 dark:border-200">
              USSD Information
            </h2>
            {informationTreeData.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No USSD information found
              </p>
            ) : null}
            <Tree
              defaultExpandAll={false}
              treeData={informationTreeData}
              draggable
              onDrop={onDrop}
              // allowDrop={allowDrop}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </DataLayout>

      {popupType ? (
        <RightSidePopup>
          <div className="flex flex-col relative">
            <button
              type="button"
              className="absolute top-0 right-0"
              onClick={() => {
                setPopupType(null);
              }}
            >
              <CloseIcon />
            </button>
            <h2 className="font-semibold text-lg">
              {`${popupType === 'add' ? 'New' : 'Edit'}`} USSD
              Information
            </h2>
            <form
              onSubmit={handleSaveCategory}
              className="flex flex-col space-y-3 mt-4"
            >
              <input
                type="text"
                value={currentNode.name}
                onChange={e =>
                  setCurrentNode(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Name"
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />
              <input
                type="text"
                value={currentNode.group}
                onChange={e =>
                  setCurrentNode(prev => ({
                    ...prev,
                    group: e.target.value,
                  }))
                }
                placeholder="Group"
                className="flex-grow dark:bg-slate-700 border border-gray-200 rounded-md py-2 px-4"
              />
              {popupType === 'add' && !currentNode.parentId ? (
                <div className="flex items-center mb-4">
                  <input
                    id="is-ticket"
                    type="checkbox"
                    value=""
                    checked={!!currentNode.isTicket}
                    onChange={e => {
                      setCurrentNode(prev => ({
                        ...prev,
                        isTicket: e.target.checked,
                      }));
                    }}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="is-ticket"
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Is Ticket
                  </label>
                </div>
              ) : null}

              <div className="flex items-center space-x-4 pt-6">
                {popupType === 'edit' ? (
                  <button
                    type="button"
                    disabled={processing}
                    onClick={handleDeleteCategory}
                    className="ml-auto bg-red-500 text-white py-2 px-4 rounded-md disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={processing}
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

export default DashboardPage;
