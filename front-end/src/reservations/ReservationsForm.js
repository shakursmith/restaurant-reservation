import React, { useState, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import {
  updateReservation,
  createReservation,
  readReservation,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationsForm({
  initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  },
}) {
  const [reservation, setReservation] = useState({ ...initialState });
  const [error, setError] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const loadReservation = async () => {
      const abortController = new AbortController();
      setError(null);
      try {
        const response = await readReservation(
          reservation_id,
          abortController.signal
        );
        setReservation(() => response);
      } catch (error) {
        setError(error);
      }
      return () => abortController.abort();
    };
    if (reservation_id) loadReservation();
  }, [reservation_id]);

  function onCancel() {
    history.go(-1);
  }

  function submitNew(newReservation) {
    const { reservation_date } = newReservation;
    const abortController = new AbortController();
    createReservation(newReservation, abortController.signal)
      .then(() => history.push(`/dashboard?date=${reservation_date}`))
      .catch(setError);
    return () => abortController.abort();
  }

  function submitUpdate(updatedReservation) {
    const abortController = new AbortController();
    updateReservation(
      updatedReservation,
      reservation_id,
      abortController.signal
    )
      .then(() => history.push(`/dashboard`))
      .catch(setError);
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setReservation((prevReservation) => {
      if (name === "people")
        return {
          ...prevReservation,
          [name]: Number(value),
        };
      return {
        ...prevReservation,
        [name]: value,
      };
    });
  }

  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    if (location.pathname.includes("edit")) {
      submitUpdate(reservation);
    } else {
      submitNew(reservation);
    }
  }

  return (
    <div>
      <ErrorAlert error={error} />
      <h1>{location.pathname.includes("edit") ? "Edit" : "New"} Reservation</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>
            First name:
            <input
              type="text"
              name="first_name"
              maxLength="20"
              value={reservation.first_name}
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Last name:
            <input
              type="text"
              name="last_name"
              maxLength="20"
              value={reservation.last_name}
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Mobile number:
            <input
              type="tel"
              name="mobile_number"
              placeholder="123-456-7890"
              pattern="^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"
              value={reservation.mobile_number}
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Date of reservation:
            <input
              type="date"
              name="reservation_date"
              placeholder="YYYY-MM-DD"
              pattern="\d{4}-\d{2}-\d{2}"
              value={reservation.reservation_date}
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Time of reservation
            <input
              type="time"
              name="reservation_time"
              placeholder="HH:MM"
              pattern="[0-9]{2}:[0-9]{2}"
              value={reservation.reservation_time}
              onChange={changeHandler}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Party size:
            <input
              type="number"
              name="people"
              min="1"
              max="50"
              value={reservation.people}
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

export default ReservationsForm;
