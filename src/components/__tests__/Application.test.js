import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, getByAltText, getAllByTestId, 
         getByPlaceholderText, getByText, getAllByAltText, queryByText,
         waitForElementToBeRemoved } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
    
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    
    });
  });


  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {

    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getAllByAltText(appointment, "Add")[0]);

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving..")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day-item").find(day => queryByText(day, "Monday"));
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();

  });


  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {

    // 1. Render the application
    const { container } = render(<Application />);

    // 2. Wait until "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    // 3. Click on the "Delete" button
    fireEvent.click(getByAltText(appointment, "Trash"));

    // 4. Check that "Do you really want to delete this appointment?" is displayed.
    expect(getByText(appointment, /Do you really want to delete this appointment?/i)).toBeInTheDocument();

    // 5. Click "Confirm" button
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6.  Check that "Deleting.." is displayed
    expect(getByText(appointment, "Deleting..")).toBeInTheDocument();

    // 7. Wait until the "Add" button is displayed
    await waitForElement(() => getByAltText(appointment, "Add"));

    // 8. Check that DayListItem is "Monday" and has "2 spots remaining."
    const day = getAllByTestId(container, "day-item").find(day => getByText(day, "Monday"));
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();

  });


  it("loads data, edits an interview and the spots remaining for Monday stay the same", async () => {
    
    // 1. Render the application
    const { container } = render(<Application />);

    // 2. Wait until "Archie Cohen" is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    // 3. Click the "Edit" button
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Change the student name
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. Click "Save"
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving..")).toBeInTheDocument();

    // 6. Wait for "Saving.." dialog to disappear, verify update
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving.."));
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();

    // 7. Verify spots remaining
    const day = getAllByTestId(container, "day-item").find(day => getByText(day, "Monday"));
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();

  });


  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add")[0]);
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving..")).toBeInTheDocument();
    
    await waitForElementToBeRemoved(() => getByText(appointment, "Saving.."));
    expect(getByText(appointment, "Failed to save. Please try again.")).toBeInTheDocument();

  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, /Are you sure you want to delete?/i)).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting..")).toBeInTheDocument();
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting.."));
    expect(getByText(appointment, "Failed to delete. Please try again.")).toBeInTheDocument();

  });

})