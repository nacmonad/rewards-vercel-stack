import { User } from "@prisma/client";
import React from "react";

import { useTable, usePagination } from "react-table";

 const UsersTable: React.FC<{ data: User[] }> = ({ data }) => {
    const columns = React.useMemo(
      () => [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Email",
          accessor: "email",
        },
        {
          Header: "Role",
          accessor: "role",
        },
      ],
      []
    );
  
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      nextPage,
      previousPage,
      canNextPage,
      canPreviousPage,
      pageOptions,
      state,
      gotoPage,
      pageCount,
      prepareRow,
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 10 }, // Initial page index and page size
      },
      usePagination
    );
  
    const { pageIndex } = state;
  
    return (
      <>
        <table {...getTableProps()} className="user-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
                
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </button>
          {pageOptions.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => gotoPage(pageNumber)}
              className={pageNumber === pageIndex ? "active" : ""}
            >
              {pageNumber + 1}
            </button>
          ))}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
      </>
    );
  };

  export default UsersTable;