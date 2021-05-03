import React, { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TablesForm() {
  const [table, setTable] = useState({
    table_name: "",
    capacity: 1,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  function onCancel() {
    history.push(`/dashboard`);
  }

  function submitNew(newTable) {
    const abortController = new AbortController();
    createTable(newTable, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setTable((prevTable) => {
      if (name === "capacity")
        return {
          ...prevTable,
          [name]: Number(value),
        };
      return {
        ...prevTable,
        [name]: value,
      };
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    submitNew(table);
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <h1>New Table</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>
            Table name:
            <input
              type="text"
              name="table_name"
              value={table.table_name}
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Capacity:
            <input
              type="number"
              name="capacity"
              min="1"
              value={table.capacity}
              onChange={changeHandler}
              required
            />
          </label>
        </div>

        <div>
          <input type="submit" value="Submit" />
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TablesForm;
