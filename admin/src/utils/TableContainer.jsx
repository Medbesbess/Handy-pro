import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit, Eye } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Rating from "../components/Rating";
import { rankItem } from "@tanstack/match-sorter-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { Switch } from "antd";

// Column Filter
const Filter = ({ column }) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={columnFilterValue ?? ""}
        onChange={(value) => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

const TableContainer = ({
  type,
  columns,
  data,
  tableclassName,
  theadclassName,
  divclassName,
  trclassName,
  thclassName,
  tdclassName,
  tbodyclassName,
  isTfoot,
  isSelect,
  isPagination,
  customPageSize,
  isGlobalFilter,
  PaginationClassName,
  SearchPlaceholder,
  setCount,
  toggle,
  userType,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const showImageModal = (imageUrl, title) => {
    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: title,
      title: title,
      width: "80%",
      imageWidth: "100%",
      imageHeight: "auto",
      showConfirmButton: false,
      showCloseButton: true,
    });
  };

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: { fuzzy: fuzzyFilter },
    state: { columnFilters, globalFilter },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: columns[1].accessorKey }],
    },
  });

  const [counter, setCounter] = useState(0);
  const {
    getHeaderGroups,
    getFooterGroups,
    getRowModel,
    getPageOptions,
    setPageIndex,
    setPageSize,
    getState,
    getCanPreviousPage,
    getCanNextPage,
    nextPage,
    previousPage,
  } = table;

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(
          `http://localhost:3001/users/admin/delete-user/${id}?type=${userType}`,
          {
            method: "DELETE",
          }
        ).then((res) => {
          if (res.ok) {
            console.log(res.json());
            setCount((prev) => prev + 1);
            Swal.fire({
              title: "Deleted!",
              text: userType + " has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleDeleteCategory = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3001/users/admin/delete-category/${id}`, {
          method: "DELETE",
        }).then((res) => {
          if (res.ok) {
            console.log(res.json());
            setCount((prev) => prev + 1);
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handleValidUser = (id, checked) => {
    fetch(`http://localhost:3001/users/admin/valid-provider/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAvailable: checked }),
    })
      .then((response) => {
        if (response.ok) {
          setCount((prev) => prev + 1);
          Swal.fire({
            icon: "success",
            title: checked
              ? `Provider Valid Successfully `
              : `Provider Invalid Successfully`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          console.error("Failed to ban user");
        }
      })
      .catch((error) => {
        console.error("Error validate user:", error);
      });
  };

  const handleBanUser = (id, checked) => {
    console.log(`User ID: ${id}, Switch Value: ${checked}`);
    fetch(`http://localhost:3001/users/admin/ban-user/${id}?type=${userType}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isBanned: checked }),
    })
      .then((response) => {
        if (response.ok) {
          setCount((prev) => prev + 1);
          Swal.fire({
            icon: "success",
            title: checked
              ? `${userType} Banned Successfully `
              : `${userType} Unbanned Successfully`,
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          console.error("Failed to ban user");
        }
      })
      .catch((error) => {
        console.error("Error banning user:", error);
      });
  };

  useEffect(() => {
    if (Number(customPageSize)) setPageSize(Number(customPageSize));
  }, [customPageSize, setPageSize, counter]);

  return (
    <Fragment>
      <div className="grid grid-cols-12 lg:grid-cols-12 gap-3">
        {isSelect && (
          <div className="self-center col-span-12 lg:col-span-6">
            <label>
              Show
              <select
                name="basic_tables_length"
                aria-controls="basic_tables"
                className="px-3 py-2 form-select border-slate-200 dark:border-zink-500 focus:outline-none focus:border-custom-500 disabled:bg-slate-100 dark:disabled:bg-zink-600 disabled:border-slate-300 dark:disabled:border-zink-500 dark:disabled:text-zink-200 disabled:text-slate-500 dark:text-zink-100 dark:bg-zink-700 dark:focus:border-custom-800 placeholder:text-slate-400 dark:placeholder:text-zink-200 inline-block w-auto"
                onClick={(event) => setPageSize(event.target.value)}
              >
                {type !== "clients" && <option value="10">10</option>}
                {type !== "clients" && <option value="25">25</option>}
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              entries
            </label>
          </div>
        )}
        <div className="self-center col-span-12 lg:col-span-6 lg:place-self-end">
          {isGlobalFilter && (
            <label>
              Search:
              <DebouncedInput
                value={globalFilter ?? ""}
                onChange={(value) => setGlobalFilter(String(value))}
                className="py-2 pr-4 text-sm text-topbar-item bg-topbar border border-topbar-border rounded pl-2 placeholder:text-slate-400 form-control focus-visible:outline-0 min-w-[200px] focus:border-blue-400"
                placeholder={SearchPlaceholder}
              />
            </label>
          )}
        </div>
      </div>
      <div className={divclassName}>
        <table className={tableclassName}>
          <thead className={theadclassName}>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={trclassName}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`${header.column.getCanSort()} ${thclassName}`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder ? null : (
                      <React.Fragment>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{ asc: " ", desc: " " }[header.column.getIsSorted()]}
                        {header.column.getCanFilter() && (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        )}
                      </React.Fragment>
                    )}
                  </th>
                ))}
                {(type === "categories" || type === "users") && (
                  <th className={thclassName}>Actions</th>
                )}
              </tr>
            ))}
          </thead>
          <tbody className={tbodyclassName}>
            {getRowModel().rows.map((row) => (
              <tr key={row.id} className={trclassName}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <>
                      {cell.column.id === "photoUrl" ||
                      cell.column.id === "image" ? (
                        <td
                          key={cell.id}
                          className={`${tdclassName} text-center`}
                          title={flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ).props.getValue()}
                        >
                          <img
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white border-2 border-blue-500 shadow-lg transform hover:scale-110 transition-transform duration-200"
                            src={flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            ).props.getValue()}
                            alt="profile image"
                          />
                        </td>
                      ) : cell.column.id === "certification" ||
                        cell.column.id === "identityCard" ? (
                        <td
                          key={cell.id}
                          className={`${tdclassName} text-center`}
                        >
                          <button
                            className="flex items-center justify-center gap-2 text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              showImageModal(
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                ).props.getValue(),
                                cell.column.id === "certification"
                                  ? "Certification"
                                  : "Identity Card"
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                            {cell.column.id === "certification"
                              ? "View Certification"
                              : "View CIN"}
                          </button>
                        </td>
                      ) : cell.column.id !== "isBanned" ? (
                        cell.column.id !== "rating" ? (
                          cell.column.id !== "isAvailable" ? (
                            <td
                              key={cell.id}
                              className={tdclassName}
                              title={flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              ).props.getValue()}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ) : (
                            <td
                              key={cell.id}
                              className={tdclassName}
                              title={flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              ).props.getValue()}
                            >
                              <Switch
                                checkedChildren="Valid"
                                unCheckedChildren="Invalid"
                                style={{
                                  backgroundColor: flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  ).props.getValue()
                                    ? "#86efac"
                                    : "#fca5a5",
                                }}
                                checked={flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                ).props.getValue()}
                                onChange={() => {
                                  handleValidUser(
                                    row.original.id,
                                    !flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    ).props.getValue()
                                  );
                                }}
                              />
                            </td>
                          )
                        ) : (
                          <td
                            key={cell.id}
                            className={tdclassName}
                            title={flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            ).props.getValue()}
                          >
                            <Rating
                              key={cell.id}
                              rating={flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              ).props.getValue()}
                            />
                          </td>
                        )
                      ) : (
                        <td
                          key={cell.id}
                          className={tdclassName}
                          title={flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          ).props.getValue()}
                        >
                          <Switch
                            checkedChildren="Banned"
                            unCheckedChildren="Active"
                            style={{
                              backgroundColor: flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              ).props.getValue()
                                ? "red"
                                : "green",
                            }}
                            checked={flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            ).props.getValue()}
                            onChange={() => {
                              handleBanUser(
                                row.original.id,
                                !flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                ).props.getValue()
                              );
                            }}
                          />
                        </td>
                      )}
                    </>
                  );
                })}
                <td
                  className={`flex justify-center items-center ${trclassName}`}
                >
                  {type === "users" && (
                    <button
                      className="flex justify-center items-center"
                      onClick={() => {
                        handleDeleteUser(row.original.id);
                        setCount((count) => count + 1);
                      }}
                    >
                      <Trash2 className="h-5 mt-4 w-5 text-red-500" />
                    </button>
                  )}
                  {type === "categories" && (
                    <div className="flex justify-between items-center gap-4">
                      <button
                        onClick={() => {
                          handleDeleteCategory(row.original.id);
                        }}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                      <button onClick={() => toggle("edit", row.original)}>
                        <Edit className="h-5 w-5 text-green-500" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {isTfoot && (
            <tfoot>
              {getFooterGroups().map((footer, tfKey) => (
                <tr key={tfKey}>
                  {footer.headers.map((tf, key) => (
                    <th
                      key={key}
                      className="p-3 text-left group-[.bordered]:border group-[.bordered]:border-slate-200 group-[.bordered]:dark:border-zink-500"
                    >
                      {flexRender(tf.column.columnDef.header, tf.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
      {isPagination && (
        <div className={PaginationClassName}>
          <div className="mb-4 grow md:mb-0">
            <div className="text-slate-500 dark:text-zink-200">
              Showing <b>{getState().pagination.pageSize}</b> of{" "}
              <b>{data.length}</b> Results
            </div>
          </div>
          <ul className="flex flex-wrap items-center gap-2 shrink-0">
            <li>
              <Link
                to="#!"
                className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto ${
                  !getCanPreviousPage() && "disabled"
                }`}
                onClick={previousPage}
              >
                <ChevronLeft className="size-4 mr-1 rtl:rotate-180" /> Prev
              </Link>
            </li>
            {getPageOptions().map((item, key) => (
              <li key={key}>
                <Link
                  to="#!"
                  className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 size-8 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 ${
                    getState().pagination.pageIndex === item && "active"
                  }`}
                  onClick={() => setPageIndex(item)}
                >
                  {item + 1}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="#!"
                className={`inline-flex items-center justify-center bg-white dark:bg-zink-700 h-8 px-3 transition-all duration-150 ease-linear border rounded border-slate-200 dark:border-zink-500 text-slate-500 dark:text-zink-200 hover:text-custom-500 dark:hover:text-custom-500 hover:bg-custom-50 dark:hover:bg-custom-500/10 focus:bg-custom-50 dark:focus:bg-custom-500/10 focus:text-custom-500 dark:focus:text-custom-500 [&.active]:text-custom-500 dark:[&.active]:text-custom-500 [&.active]:bg-custom-50 dark:[&.active]:bg-custom-500/10 [&.active]:border-custom-50 dark:[&.active]:border-custom-500/10 [&.active]:hover:text-custom-700 dark:[&.active]:hover:text-custom-700 [&.disabled]:text-slate-400 dark:[&.disabled]:text-zink-300 [&.disabled]:cursor-auto ${
                  !getCanNextPage() && "disabled"
                }`}
                onClick={nextPage}
              >
                Next <ChevronRight className="size-4 ml-1 rtl:rotate-180" />
              </Link>
            </li>
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default TableContainer;
