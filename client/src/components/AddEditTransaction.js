import { Form, Input, message, Modal, Select } from "antd";
import { Option } from "antd/lib/mentions";
import axios from "axios";
import React, { useState } from "react";
import Spinner from "./Spinner";

function AddEditTransaction({
  SetshowAddEditTransactionModel,
  showAddEditTransactionModel,
  selectedItemForEdit,
  setselectedItemForEdit,
  getTransaction,
}) {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("moneymanager"));
      setLoading(true);
      if (selectedItemForEdit) {
        await axios.post("/api/transactions/edit-transaction", {
          payload: { ...values, userid: user._id },
          transactionId: selectedItemForEdit._id,
        });
        getTransaction();
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("/api/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        getTransaction();
        message.success("Transaction Added Successfully");
      }
      SetshowAddEditTransactionModel(false);
      setselectedItemForEdit(null);
      setLoading(false);
    } catch (error) {
      message.error("Something Went Wrong");
      setLoading(false);
    }
  };
  return (
    <Modal
      title={selectedItemForEdit ? "Edit Transaction" : "Add Transaction"}
      visible={showAddEditTransactionModel}
      onCancel={() => SetshowAddEditTransactionModel(false)}
      footer={false}
    >
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="transaction-form"
        onFinish={onFinish}
        initialValues={selectedItemForEdit}
      >
        <Form.Item label="Amount" name="amount">
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Divisions" name="divisions">
          <Select>
            <Option value="office">Office</Option>
            <Option value="personal">Personal</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Type" name="type">
          <Select>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Select>
            <Option value="salary">Salary</Option>
            <Option value="freelance">Freelance</Option>
            <Option value="investments">Investments</Option>
            <Option value="dividends">Dividends</Option>
            <Option value="emi">EMI</Option>
            <Option value="rent">Rent</Option>
            <Option value="food">Food</Option>
            <Option value="entertainment">Entertainment</Option>
            <Option value="travel">Travel</Option>
            <Option value="education">Education</Option>
            <Option value="medical">Medical</Option>
            <Option value="tax">Tax</Option>
            <Option value="fuel">Fuel</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Date" name="date">
          <Input type="date" />
        </Form.Item>

        <Form.Item label="Reference" name="reference">
          <Input type="text" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input type="text" />
        </Form.Item>

        <div className="d-flex justify-content-end">
          <button className="primary" type="submit">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditTransaction;
