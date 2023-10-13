import React, { useState, useEffect } from "react";
import "./ReceiptCrud.css";
import { nanoid } from "nanoid";
import { useNavigate, useLocation } from "react-router-dom";
import {TextField, Input } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from "xlsx";

const AddReceipt = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentDate = new Date();
  const formattedDate = `${currentDate.getDate()} - ${
    currentDate.getMonth() + 1
  } - ${currentDate.getFullYear()}`;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [receipt, setReceipt] = useState({
      receiptNumber: nanoid(), // Auto-generated
      receiptDate: formattedDate, // Default to current date
      personName: "",
      lineItems: [
          { description: "", unit: "", rate: 0, qty: 0, Discount: 0, amount: 0 },
        ],
        remarks: "",
        totalQty: "",
        totalAmount: "",
        netAmount: "",
    });
    const [totalQty, setTotalQty] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const ariaLabel = { 'aria-label': 'description' };


    const inputBoxStyle = {
        border: 'none',
        outline: 'none',
        background: 'none',
        padding: '10',
        fontSize: 'inherit',
        fontFamily: 'inherit',
        color: 'inherit',
      }

  useEffect(() => {
    // Calculate Total Quantity and Total Amount when lineItems change
    const newTotalQty = receipt.lineItems.reduce(
      (total, item) => total + item.qty,
      0
    );
    const newTotalAmount = receipt.lineItems.reduce(
      (total, item) => total + item.amount,
      0
    );

    // Calculate the total discount
    const totalDiscount = receipt.lineItems.reduce(
      (total, item) => total + item.discount,
      0
    );

    // Calculate the net amount
    const newNetAmount = newTotalAmount - totalDiscount;

    setReceipt({
      ...receipt,
      totalQty: newTotalQty,
      totalAmount: newTotalAmount,
      netAmount: newNetAmount,
    });

    setTotalQty(newTotalQty);
    setTotalAmount(newTotalAmount);
    setNetAmount(newNetAmount);
  }, [receipt.lineItems]);

  const handleAddLineItem = () => {

    
    setReceipt({
      ...receipt,
      lineItems: [
        ...receipt.lineItems,
        { description: "", rate: 0, qty: 0, amount: 0 },
      ],
    });
  };

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...receipt.lineItems];
    updatedLineItems[index][field] = value;

    // Calculate the amount for the line item with discount added
    const amountWithoutDiscount =
      updatedLineItems[index].rate * updatedLineItems[index].qty;
    updatedLineItems[index].amount =
      amountWithoutDiscount + updatedLineItems[index].discount;

    // Calculate the total discount
    const totalDiscount = updatedLineItems.reduce(
      (total, item) => total + item.discount,
      0
    );

    // Calculate the net amount by subtracting total discount from total amount
    const newNetAmount = totalAmount - totalDiscount;

    setReceipt({ ...receipt, lineItems: updatedLineItems });

    // Update the netAmount state with the newNetAmount
    setNetAmount(newNetAmount);
  };

  const handleDeleteLineItem = (indexToDelete) => {
    const updatedLineItems = [...receipt.lineItems];
    updatedLineItems.splice(indexToDelete, 1); // Remove the line item at the specified index

    // Recalculate the total amounts and update the state
    const newTotalQty = updatedLineItems.reduce(
      (total, item) => total + item.qty,
      0
    );
    const newTotalAmount = updatedLineItems.reduce(
      (total, item) => total + item.amount,
      0
    );

    setReceipt({
      ...receipt,
      lineItems: updatedLineItems,
      totalQty: newTotalQty,
      totalAmount: newTotalAmount,
      netAmount: newTotalAmount, 
    });
  };

  const handleSave = () => {
    // Save data to local storage
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
    savedReceipts.push(receipt);
    console.log("receipt", receipt);
    localStorage.setItem("receipts", JSON.stringify(savedReceipts));
    setReceipt({
      ...receipt,
      personName: "",
      lineItems: [
        { description: "", unit: "", rate: 0, qty: 0, Discount: 0, amount: 0 },
      ],
      remarks: "",
      totalQty: "",
      totalAmount: "",
      netAmount: "",
    });
    alert("Receipt saved successfully!");
    navigate("/receipt-list");
  };

  const handleDelete = () => {
    setReceipt({
      ...receipt,
      personName: "",
      lineItems: [
        { description: "", unit: "", rate: 0, qty: 0, Discount: 0, amount: 0 },
      ],
      remarks: "",
      totalQty: "",
      totalAmount: "",
      netAmount: "",
    });
    alert("Receipt deleted successfully!");
  };

  const handleExportToExcel = () => {
    const dataForExcel = receipt.lineItems.map((lineItem, index) => ({
      "S.No.": index + 1,
      "Receipt No": receipt.receiptNumber,
      "Receipt Date": receipt.receiptDate,
      "Person Name": receipt.personName,
      Description: lineItem.description,
      Unit: lineItem.unit,
      Rate: lineItem.rate,
      Qty: lineItem.qty,
      Discount: lineItem.discount,
      Amount: lineItem.amount,
      Remarks: receipt.remarks,
      "Net Amount": receipt.netAmount,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Receipt Data");
    XLSX.writeFile(wb, "ReceiptData.xlsx");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      navigate(`${location.pathname}`);
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <>
      <div className="add-receipt-container">
      <h3 className="text-center mb-4">Receipt CRUD</h3>
     
    </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => handleSave()}
      >
        Save
      </button>
      <button
        type="button"
        className="btn btn-secondary ml-2"
        onClick={() => handleRefresh()}
      >
        Refresh
      </button>
      <button
        type="button"
        className="btn btn-success ml-2"
        onClick={() => handleExportToExcel()}
      >
        Export to Excel
      </button>

      <button
        type="button"
        className="btn btn-danger"
        onClick={() => handleDelete()}
      >
        Delete
      </button>
      {isRefreshing && <div className="loader">Loading...</div>}
      <form className="crud-form">
        <div>
          <label>Receipt Number: {receipt.receiptNumber}</label>
        </div>
        <div>
          <label>Receipt Date: {receipt.receiptDate}</label>
        </div>
        <div>
          <label>Person's Name:</label>
          <Input required placeholder="Enter Name" inputProps={ariaLabel} value={receipt.personName}
          onChange={(e) =>
            setReceipt({ ...receipt, personName: e.target.value })
          }/>
        </div>
        <div></div>
        <table className="table">
              <thead>
                <tr>
                  <th scope="col">Description</th>
                  <th scope="col">Unit</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {receipt.lineItems.map((lineItem, index) => (
              <tr key={index}>
                <td>
                <input
                        type="text"
                        style={inputBoxStyle}
                        placeholder="Enter description"
                        value={lineItem.description}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                </td>
                <td>
                <input
                        type="text"
                        placeholder="Enter unit"
                        style={inputBoxStyle}
                        value={lineItem.unit}
                        onChange={(e) =>
                          handleLineItemChange(index, "unit", e.target.value)
                        }
                      />

                </td>
                <td>
                <input
                        type="number"
                        placeholder="Enter rate"
                        style={inputBoxStyle}
                        value={lineItem.rate}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "rate",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                </td>
                <td>
                <input
                        type="number"
                        placeholder="Enter qty"
                        style={inputBoxStyle}
                        value={lineItem.qty}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "qty",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                  
                </td>
                <td>
                <input
                        type="number"
                        placeholder="Enter discount"
                        style={inputBoxStyle}
                        value={lineItem.discount}
                        onChange={(e) =>
                          handleLineItemChange(
                            index,
                            "discount",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                </td>
                <td>{lineItem.amount}</td>
                <td>
                <button type="button" className=" btn btn-primary" onClick={() => handleAddLineItem()}>
  Insert
</button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteLineItem(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <label>Remarks:</label>
          <textarea
            value={receipt.remarks}
            onChange={(e) =>
              setReceipt({ ...receipt, remarks: e.target.value })
            }
          />
        </div>
        <div>
          <label>Total Qty: {totalQty}</label>
        </div>
        <div>
          <label>Total Amount: {totalAmount}</label>
        </div>
        <div>
          <label>Net Amount: {netAmount}</label>
        </div>
        
      </form>
    </>
  );
};

export default AddReceipt;
