import { message, Select, Table, DatePicker } from "antd";
import { Option } from "antd/lib/mentions";
import axios from "axios";
import React, { useEffect, useState } from "react";
import moment from "moment";
import AddEditTransaction from "../components/AddEditTransaction";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/transactions.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

function Home() {
  const [
    showAddEditTransactionModel,
    SetshowAddEditTransactionModel,
  ] = useState(false);

  const [loading, setLoading] = useState(false);
  const [transactionsData, setTransactionData] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [divisions, setDivisions] = useState("all");
  const [selectedRange, setSelectedRange] = useState([]);
  const [viewType, setViewType] = useState("table");
  const [selectedItemForEdit, setselectedItemForEdit] = useState(null);
  const getTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("moneymanager"));
      setLoading(true);
      const response = await axios.post(
        "/api/transactions/get-all-transactions",
        {
          userid: user._id,
          frequency,
          ...(frequency === "custom" && { selectedRange }),
          type,
          divisions,
        }
      );
      setTransactionData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something Went Wrong");
    }
  };

  const deleteTransaction = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/transactions/delete-transaction", {
        transactionId: record._id,
      });
      message.success("Transaction Deleted Successfully");
      getTransaction();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getTransaction();
  }, [frequency, selectedRange, type, divisions]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => <span>{moment(text).format("DD-MM-YYYY")}</span>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Divisions",
      dataIndex: "divisions",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setselectedItemForEdit(record);
                SetshowAddEditTransactionModel(true);
              }}
            />
            <DeleteOutlined
              className="mx-3"
              onClick={() => {
                deleteTransaction(record);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(value) => setFrequency(value)}>
              <Option value="7">Last 1 Week</Option>
              <Option value="30">Last 1 Month</Option>
              <Option value="365">Last 1 Year</Option>
              <Option value="custom">Custom</Option>
            </Select>

            {frequency === "custom" && (
              <div className="mt-2">
                <RangePicker
                  value={selectedRange}
                  format={"DD-MM-YYYY"}
                  onChange={(values) => setSelectedRange(values)}
                />
              </div>
            )}
          </div>
          <div className="d-flex flex-column mx-5">
            <h6>Select Division</h6>
            <Select value={divisions} onChange={(value) => setDivisions(value)}>
              <Option value="all">All</Option>
              <Option value="office">Office</Option>
              <Option value="personal">Personal</Option>
            </Select>
          </div>
          <div className="d-flex flex-column">
            <h6>Select Type</h6>
            <Select value={type} onChange={(value) => setType(value)}>
              <Option value="all">All</Option>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </div>
        </div>

        <div className="d-flex">
          <div>
            <div className="view-switch mx-3">
              <UnorderedListOutlined
                className={`mx-2 ${
                  viewType === "table" ? "active-icon" : "inactive-icon"
                }`}
                onClick={() => setViewType("table")}
              />
              <AreaChartOutlined
                className={`${
                  viewType === "analytics" ? "active-icon" : "inactive-icon"
                }`}
                onClick={() => setViewType("analytics")}
              />
            </div>
          </div>
          <button
            className="primary"
            onClick={() => SetshowAddEditTransactionModel(true)}
          >
            ADD NEW
          </button>
        </div>
      </div>

      <div className="tabel-analytics">
        {viewType === "table" ? (
          <div className="table">
            <Table columns={columns} dataSource={transactionsData} />
          </div>
        ) : (
          <Analytics transactions={transactionsData} />
        )}
      </div>

      {showAddEditTransactionModel && (
        <AddEditTransaction
          showAddEditTransactionModel={showAddEditTransactionModel}
          SetshowAddEditTransactionModel={SetshowAddEditTransactionModel}
          selectedItemForEdit={selectedItemForEdit}
          getTransaction={getTransaction}
          setselectedItemForEdit={setselectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;
