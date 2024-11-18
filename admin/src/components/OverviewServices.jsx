import React, { useState, useEffect, useMemo } from 'react';
import TableContainer from '../utils/TableContainer';

const OverviewServices = () => {
  const [services, setServices] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = "All services";
    fetch('http://localhost:3001/services')
      .then((response) => response.json())
      .then((data) => {        
        setServices(data);  
      })
      .catch((error) => {
        console.error(error);
      });
  }, [count]);

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
        enableColumnFilter: false,
        enableSorting: true,
      },
      
      {
        header: 'Category',
        accessorKey: 'category.name',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Provider',
        accessorKey: 'provider.email',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Price ($)',
        accessorKey: 'price',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Duration (min)',
        accessorKey: 'duration',
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: 'Status',
        accessorKey: 'isActive',
        enableColumnFilter: false,
        enableSorting: true,
        Cell: ({ cell: { value } }) => (value ? 'Yes' : 'No'),
      },
    ],
    []
  );

  return (

      <React.Fragment>
        <div className="card w-full flex justify-center p-10">
          
          <div className="card-body w-[95%] p-4 shadow-lg border border-gray-200">
              <h2 className="font-bold text-2xl pb-5">All Services</h2>
            <TableContainer
              type="services"
              setCount={setCount}
              isPagination={true}
              isTfoot={true}
              isSelect={true}
              isGlobalFilter={true}
              columns={columns || []}
              data={services || []}
              customPageSize={10}
              divclassName="my-2 col-span-12 overflow-x-auto lg:col-span-12"
              tableclassName="display stripe group dataTable w-full text-sm align-middle whitespace-nowrap"
              theadclassName="border-b border-slate-200 dark:border-zink-500"
              thclassName="ltr:!text-left rtl:!text-right p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500 sorting px-3 py-4 text-slate-900 bg-slate-200/50 font-semibold text-left dark:text-zink-50 dark:bg-zink-600 dark:group-[.bordered]:border-zink-500 sorting_asc"
              tdclassName="p-3 group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500"
              PaginationClassName="flex flex-col items-center mt-5 md:flex-row"
            />
          </div>
        </div>
      </React.Fragment>

  );
};

export default OverviewServices;
