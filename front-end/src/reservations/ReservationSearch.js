import React, { useState } from "react";
import { useHistory } from "react-router";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import formatReservationTime from "../utils/format-reservation-time";
import formatReservationDate from "../utils/format-reservation-date";
import ReservationCards from "./ReservationCards";

function ReservationSearch() {
  const [reservations, setReservations] = useState([]);
  const [mobile, setMobile] = useState();
  const [error, setError] = useState(null);
  const history = useHistory();

  function onCancel() {
    history.push(`/dashboard`);
  }

  function submitNew(mobile_number) {
    const abortController = new AbortController();
    listReservations({ mobile_number }, abortController.signal)
      .then(setReservations)
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setMobile((prev) => {
      return { ...prev, [name]: value };
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const { mobile_number } = mobile;
    submitNew(mobile_number);
  }

  const cards = reservations.map((reservation, key) => {
    formatReservationTime(reservation);
    formatReservationDate(reservation);
    return <ReservationCards reservation={reservation} key={key} />;
  });

  return (
    <div>
      <ErrorAlert error={error} />
      <h1>Search by mobile number</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>
            <input
              type="tel"
              name="mobile_number"
              placeholder="123-456-7890"
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <input type="submit" value="Find" />
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
      <div className="row justify-content-center">
        {cards.length > 0 ? (
          cards
        ) : (
          <p className="lead">No reservations found</p>
        )}
      </div>
    </div>
  );
}

export default ReservationSearch;
