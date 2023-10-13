import React, { useState, useEffect, useRef } from "react";
import "./ReceiptCrud.css";
import { useNavigate, useParams } from "react-router-dom";

const EditReceipt = () => {
  const navigate = useNavigate();
  const currentReceipt = useRef();
  const { receiptNumber } = useParams(); // Retrieve the receiptNumber from params

  const initialReceipt = {
    receiptNumber: "",
    receiptDate: "",
    personName: "",
    lineItems: [
      { description: "", unit: "", rate: 0, qty: 0, discount: 0, amount: 0 },
    ],
    remarks: "",
    totalQty: 0,
    totalAmount: 0,
    netAmount: 0,
  };

  const inputBoxStyle = {
    border: 'none',
    outline: 'none',
    background: 'none',
    padding: '10',
    fontSize: 'inherit',
    fontFamily: 'inherit',
    color: 'inherit',
  }

  const [receipt, setReceipt] = useState(initialReceipt);
  const [totalQty, setTotalQty] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  useEffect(() => {
    if (receiptNumber) {
      // Retrieve the existing receipt data from localStorage based on the receiptNumber
      const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
      const existingReceipt = savedReceipts.find(
        (receipt) => receipt.receiptNumber === receiptNumber
      );
        currentReceipt.current = existingReceipt;
        setReceipt(receipt => ({...receipt, existingReceipt}));
        setTotalQty(existingReceipt.totalQty);
        setTotalAmount(existingReceipt.totalAmount);
        setNetAmount(existingReceipt.netAmount);
    }
  }, [receiptNumber]);

  useEffect(()=>{
    setReceipt(currentReceipt.current)
  }, [receipt])


  useEffect(() => {
    // Calculate Total Quantity and Total Amount when lineItems change
    const newTotalQty = receipt?.lineItems?.reduce(
      (total, item) => total + item.qty,
      0
    );
    const newTotalAmount = receipt?.lineItems?.reduce(
      (total, item) => total + item.amount,
      0
    );
    setReceipt({
      ...receipt,
      totalQty: newTotalQty,
      totalAmount: newTotalAmount,
    });
    setTotalQty(newTotalQty);
    setTotalAmount(newTotalAmount);
  }, [receipt?.lineItems]);

  const handleAddLineItem = () => {
    setReceipt({
      ...receipt,
      lineItems: [
        ...receipt?.lineItems,
        { description: "", rate: 0, qty: 0, amount: 0 },
      ],
    });
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

  const handleLineItemChange = (index, field, value) => {
    const updatedLineItems = [...receipt?.lineItems];
    updatedLineItems[index][field] = value;

    // Calculate the amount for the line item
    updatedLineItems[index].amount =
      updatedLineItems[index].rate * updatedLineItems[index].qty;

    setReceipt({ ...receipt, lineItems: updatedLineItems });
  };

  const handleSave = () => {
    const savedReceipts = JSON.parse(localStorage.getItem("receipts")) || [];
  
    // Find an existing receipt with the same receiptNumber
    const existingReceiptIndex = savedReceipts.findIndex(
      (savedReceipt) => savedReceipt.receiptNumber === receipt.receiptNumber
    );
  
    if (existingReceiptIndex !== -1) {
      // If an existing receipt is found, update its data
      savedReceipts[existingReceiptIndex] = receipt;
    } else {
      // If no existing receipt is found, push the new receipt
      savedReceipts.push(receipt);
    }
  
    localStorage.setItem("receipts", JSON.stringify(savedReceipts));
    alert("Receipt Updated successfully!");
    navigate("/receipt-list");
  };
  
  console.log("receipt--", receipt);
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
    });
    alert("Receipt deleted successfully!");
  };

  return (
    <>
      {receipt && (
        <>
          <div className="add-receipt-container">
      <h3 className="text-center mb-4">Receipt CRUD</h3>
     
    </div>
          <button style={{ position: 'absolute' , right: '137px' , top:'34px' }}  
            type="button"
            className="btn btn-primary"
            onClick={() => handleSave()}
          >
            Save
          </button>
          <button style={{ position: 'absolute' , right: '56px', top:'34px'  }}  
            type="button"
            className="btn btn-danger"
            onClick={() => handleDelete()}
          >
            Delete
          </button>
          <form className="crud-form">
            <div>
              <label>Receipt Number: {receipt?.receiptNumber}</label>
              
            </div>
            <div>
              <label>Receipt Date: {receipt?.receiptDate}</label>
            </div>
            <div>
              <label>Person's Name: {receipt?.personName}</label>
            </div>
            <div>
              
            </div>
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
                {receipt?.lineItems?.map((lineItem, index) => (
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
                    
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
          <label>Remarks:</label>
          <textarea
            value={receipt?.remarks}
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
      )}
    </>
  );
};

export default EditReceipt;
