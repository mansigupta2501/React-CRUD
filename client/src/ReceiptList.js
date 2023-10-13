import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';



const ReceiptList = ({ username, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [receiptList, setReceiptList] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddReceipt = () => {
    navigate('/add-receipt');
  };

  const handleEditReceipt = (receiptNumber) => {
    navigate(`/edit-receipt/${receiptNumber}`);
  };

  useEffect(() => {
    const receiptListFromLocalStorage = localStorage.getItem('receipts');
    const parsedReceiptList = JSON.parse(receiptListFromLocalStorage) || [];
    setReceiptList(parsedReceiptList);
  }, []);

  const handleDeleteList = (receiptNumber) => {
    const updatedReceiptList = receiptList.filter((receipt) => receipt.receiptNumber !== receiptNumber);
    localStorage.setItem('receipts', JSON.stringify(updatedReceiptList));
    console.log('receiptList after deletion', updatedReceiptList);
    alert('Receipt deleted successfully!');
    setReceiptList(updatedReceiptList);
  };

  const handleExportToExcel = () => {
    const dataForExcel = receiptList.map((receipt, index) => ({
      'S.No.': index + 1,
      'Receipt No': receipt.receiptNumber,
      'Receipt Date': receipt.receiptDate,
      'Person Name': receipt.personName,
      'Total Qty': receipt.totalQty,
      'Net Amount': receipt.netAmount,
      Remarks: receipt.remarks,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receipt Data');
    XLSX.writeFile(wb, 'ReceiptData.xlsx');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      navigate(`${location.pathname}`);
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="text-center"> 
      <h1>Welcome, {username}!</h1>
      <button style={{ position: 'absolute', right: '7px', color: 'red' ,top:'12px' }} onClick={onLogout}>
  Logout
</button>

      <p></p>
      <h3>Receipt List </h3>
      <div className="d-flex justify-content-end align-items-center mb-3">
      <button type="button" className="btn btn-primary" style={{ position: 'absolute' , right: '290px' }} onClick={handleAddReceipt}>
  Add
</button>
        <button type="button" className="btn btn-secondary ml-2" style={{ position: 'absolute' , right: '204px' }}  onClick={handleRefresh}>
          Refresh
        </button>
        <button type="button" className="btn btn-success ml-2" style={{ position: 'absolute' , right: '65px' }}  onClick={handleExportToExcel}>
          Export to Excel
        </button>
        <button type="button" className="btn btn-danger ml-2" style={{ position: 'absolute' , right: '5px' }}  onClick={onLogout}>
          Exit
        </button>
      </div>

      {isRefreshing && <div className="loader">Loading...</div>}

      <table className="table table-striped">
        <thead className="thead-dark">
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Receipt No</th>
            <th scope="col">Receipt Date</th>
            <th scope="col">Person Name</th>
            <th scope="col">Total Qty</th>
            <th scope="col">Net Amount</th>
            <th scope="col">Remarks</th>
            <th scope="col">Edit/Delete</th>
          </tr>
        </thead>
        <tbody >
          {receiptList &&
            receiptList.map((receipt, index) => (
              <tr key={index}>
                <th style={{height:'50px'}} scope="row">{index + 1}</th>
                <td>{receipt.receiptNumber}</td>
                <td>{receipt.receiptDate}</td>
                <td>{receipt.personName}</td>
                <td>{receipt.totalQty}</td>
                <td>{receipt.netAmount}</td>
                <td>{receipt.remarks}</td>
                <td>
                  <button type="button" className="btn btn-warning"style={{ position: 'absolute' , right: '86px' }}  onClick={() => handleEditReceipt(receipt.receiptNumber)}>
                    Edit
                  </button>
                  <button type="button" className="btn btn-danger" style={{ position: 'absolute' , right: '10px' }} onClick={() => handleDeleteList(receipt.receiptNumber)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReceiptList;
